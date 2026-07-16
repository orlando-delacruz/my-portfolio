// src/pages/admin/CMS/Branches/Branches.jsx
import { memo, useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Alert, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useBranchesAdmin, useUpdateBranchesSection } from "../../../../hooks/cms/useBranches";
import BranchItemModal from "../../../../components/admin/Modal/BranchItemModal";
import * as S from "./Branches.styled";

const Branches = () => {
  const { data: sectionData, isLoading, error, refetch } = useBranchesAdmin();
  const updateMutation = useUpdateBranchesSection();
  const [form] = Form.useForm();

  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (sectionData) {
      form.setFieldsValue({
        pre_title: sectionData.pre_title || "",
        title: sectionData.title || "",
        highlight_text: sectionData.highlight_text || "",
      });
      // This is a controlled sync from external data – safe to ignore the warning
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(sectionData.items || []);
    }
  }, [sectionData, form]);

  const handleAddItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveItem = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === items.length - 1) return;
    setItems((prev) => {
      const newList = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [newList[index], newList[swapIndex]] = [newList[swapIndex], newList[index]];
      return newList;
    });
  };

  const handleModalSave = async (values) => {
    setModalLoading(true);
    try {
      const itemData = {
        ...values,
        services: values.services || "",
        id: editingItem?.id,
      };

      if (editingItem) {
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...itemData } : item))
        );
      } else {
        const newItem = {
          ...itemData,
          id: `temp-${Date.now()}`,
          display_order: items.length,
        };
        setItems((prev) => [...prev, newItem]);
      }
      setModalOpen(false);
      setEditingItem(null);
      message.success(editingItem ? "Branch updated." : "Branch added.");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to save branch.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleFinish = async (values) => {
    if (!sectionData) {
      message.error("Branch section data is not loaded. Please refresh the page.");
      return;
    }

    setSaving(true);
    try {
      if (items.length === 0) {
        message.error("Please add at least one branch.");
        setSaving(false);
        return;
      }

      const invalid = items.some((item) => {
        return !item.name || !item.location || !item.map_embed_url || !item.address ||
          !item.phone || !item.email || !item.hours || !item.services;
      });
      if (invalid) {
        message.error("All branches must have name, location, map URL, address, phone, email, hours, and services.");
        setSaving(false);
        return;
      }

      const payload = {
        id: sectionData.id,
        pre_title: values.pre_title,
        title: values.title,
        highlight_text: values.highlight_text,
        is_active: true,
        items: items.map((item, index) => ({
          name: item.name,
          location: item.location,
          map_embed_url: item.map_embed_url,
          address: item.address,
          phone: item.phone,
          email: item.email,
          hours: item.hours,
          services: item.services || "",
          display_order: index,
          is_active: item.is_active !== undefined ? item.is_active : true,
          ...(item.id && !item.id.startsWith("temp-") ? { id: item.id } : {}),
        })),
      };

      await updateMutation.mutateAsync(payload);
      message.success("Branches section updated successfully!");
      await refetch();
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to update branches section. Please check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <S.LoadingContainer>
          <Spin size="large" />
        </S.LoadingContainer>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.Container>
          <Alert type="error" message="Failed to load branches data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  const renderItemRow = (item, index) => {
    const serviceList = item.services
      ? item.services.split("\n").filter((s) => s.trim())
      : [];

    return (
      <S.ItemRow key={item.id || index}>
        <S.ItemContent>
          <S.ItemName>{item.name || "Unnamed Branch"}</S.ItemName>
          <S.ItemMeta>
            <span>{item.location || "—"}</span>
            <span>•</span>
            <span>{serviceList.length} service{serviceList.length !== 1 ? "s" : ""}</span>
          </S.ItemMeta>
        </S.ItemContent>
        <S.ItemActions>
          <Tooltip title="Move up">
            <Button icon={<ArrowUpOutlined />} size="small" disabled={index === 0} onClick={() => handleMoveItem(index, "up")} />
          </Tooltip>
          <Tooltip title="Move down">
            <Button icon={<ArrowDownOutlined />} size="small" disabled={index === items.length - 1} onClick={() => handleMoveItem(index, "down")} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEditItem(item)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteItem(index)} />
          </Tooltip>
          <S.StatusBadge $active={item.is_active !== false}>
            {item.is_active !== false ? "Active" : "Inactive"}
          </S.StatusBadge>
        </S.ItemActions>
      </S.ItemRow>
    );
  };

  return (
    <AdminLayout>
      <S.Container>
        <S.Header>
          <S.Title>Branches Section</S.Title>
          <S.Subtitle>Manage the branches displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Section Content</S.SectionTitle>
            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: "Pre-title is required." }]}
            >
              <Input placeholder="e.g., Our Branches" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required." }]}
            >
              <Input placeholder="e.g., Visit Our " />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: "Highlight text is required." }]}
            >
              <Input placeholder="e.g., Clinic Branches" />
            </Form.Item>

            <S.SectionTitle>Branches</S.SectionTitle>
            <S.ItemList>
              {items.length === 0 ? (
                <S.EmptyState>No branches added yet. Click "Add Branch" to create one.</S.EmptyState>
              ) : (
                items.map(renderItemRow)
              )}
            </S.ItemList>

            <S.AddButtonWrapper>
              <Button type="dashed" onClick={handleAddItem} icon={<PlusOutlined />} block>
                Add Branch
              </Button>
            </S.AddButtonWrapper>

            <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </S.Card>
      </S.Container>

      <BranchItemModal
        open={modalOpen}
        item={editingItem}
        onClose={handleModalCancel}
        onSave={handleModalSave}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default memo(Branches);