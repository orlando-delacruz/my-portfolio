// ================================================================
// FILE: src/pages/admin/CMS/FAQs/FAQs.jsx
// ================================================================

import { memo, useState, useEffect } from "react";
import { Form, Input, Button, message, Spin, Alert, Tooltip, Upload } from "antd";
import { PlusOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { useFaqsAdmin, useUpdateFaqs, uploadFaqFormImage, FAQS_QUERY_KEY } from "../../../../hooks/cms/useFaqs";
import FaqItemModal from "../../../../components/admin/Modal/FaqItemModal";
import * as S from "./FAQs.styled";

// Helper: convert URL to UploadFile
const urlToUploadFile = (url) => {
  if (!url) return null;
  return {
    uid: "-1",
    name: url.split("/").pop() || "image",
    status: "done",
    url,
  };
};

const FAQs = () => {
  const { data: sectionData, isLoading, error, refetch } = useFaqsAdmin();
  const updateMutation = useUpdateFaqs();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Populate form when data loads
  useEffect(() => {
    if (sectionData) {
      form.setFieldsValue({
        pre_title: sectionData.pre_title || "",
        title: sectionData.title || "",
        highlight_text: sectionData.highlight_text || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems(sectionData.items || []);

      // Set image file list
      if (sectionData.form_image) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFileList([urlToUploadFile(sectionData.form_image)]);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFileList([]);
      }
    }
  }, [sectionData, form]);

  const handleImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

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
      message.success(editingItem ? "FAQ updated." : "FAQ added.");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Failed to save FAQ.");
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
      message.error("FAQ section data is not loaded. Please refresh the page.");
      return;
    }

    setSaving(true);
    try {
      // Upload image if new file
      let form_image = sectionData.form_image || null;
      const newFile = fileList.find(f => f.originFileObj);
      if (newFile) {
        setUploading(true);
        try {
          form_image = await uploadFaqFormImage(newFile.originFileObj);
        } catch (uploadErr) {
          message.error(uploadErr.message || "Image upload failed");
          setUploading(false);
          setSaving(false);
          return;
        }
        setUploading(false);
      } else if (fileList.length === 0) {
        form_image = null;
      }

      if (items.length === 0) {
        message.error("Please add at least one FAQ.");
        setSaving(false);
        return;
      }

      const invalid = items.some((item) => {
        return !item.question || !item.answer;
      });
      if (invalid) {
        message.error("All FAQs must have a question and an answer.");
        setSaving(false);
        return;
      }

      const payload = {
        id: sectionData.id,
        pre_title: values.pre_title,
        title: values.title,
        highlight_text: values.highlight_text,
        form_image,
        is_active: true,
        items: items.map((item, index) => ({
          question: item.question,
          answer: item.answer,
          display_order: index,
          is_active: item.is_active !== undefined ? item.is_active : true,
          ...(item.id && !item.id.startsWith("temp-") ? { id: item.id } : {}),
        })),
      };

      await updateMutation.mutateAsync(payload);

      // Force immediate refetch of the public query using the queryClient directly
      await queryClient.refetchQueries({ queryKey: [FAQS_QUERY_KEY], type: "active" });

      message.success("FAQs section updated successfully!");
      await refetch();
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to update FAQs section.");
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
          <Alert type="error" message="Failed to load FAQs data" description={error.message} showIcon />
        </S.Container>
      </AdminLayout>
    );
  }

  const renderItemRow = (item, index) => {
    const preview = item.question && item.question.length > 60
      ? item.question.substring(0, 60) + "..."
      : item.question || "Untitled";

    return (
      <S.ItemRow key={item.id || index}>
        <S.ItemContent>
          <S.ItemName>{preview}</S.ItemName>
          <S.ItemMeta>
            <span>Order: {item.display_order || index}</span>
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
          <S.Title>FAQs Section</S.Title>
          <S.Subtitle>Manage the frequently asked questions displayed on your public homepage.</S.Subtitle>
        </S.Header>

        <S.Card>
          <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
            <S.SectionTitle>Section Content</S.SectionTitle>

            <Form.Item
              name="pre_title"
              label="Pre-title"
              rules={[{ required: true, message: "Pre-title is required." }]}
            >
              <Input placeholder="e.g., FAQ" size="large" />
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Title is required." }]}
            >
              <Input placeholder="e.g., Frequently Asked " size="large" />
            </Form.Item>

            <Form.Item
              name="highlight_text"
              label="Highlight Text"
              rules={[{ required: true, message: "Highlight text is required." }]}
            >
              <Input placeholder="e.g., Questions" size="large" />
            </Form.Item>

            <S.SectionTitle>FAQ Form Image</S.SectionTitle>

            <Form.Item
              label="Image above the 'Send Your Questions' form"
              rules={[
                {
                  validator: () => {
                    if (fileList.length === 0 && !sectionData?.form_image) {
                      return Promise.reject(new Error("Please upload an image."));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageChange}
                beforeUpload={() => false}
                accept="image/*"
                maxCount={1}
              >
                {fileList.length === 0 && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              {uploading && <div style={{ marginTop: 4, color: "#1890ff" }}>Uploading...</div>}
              <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
                Supported: PNG, JPG, JPEG, WEBP (Max 5MB)
              </div>
            </Form.Item>

            <S.SectionTitle>FAQs</S.SectionTitle>
            <S.ItemList>
              {items.length === 0 ? (
                <S.EmptyState>No FAQs added yet. Click "Add FAQ" to create one.</S.EmptyState>
              ) : (
                items.map(renderItemRow)
              )}
            </S.ItemList>

            <S.AddButtonWrapper>
              <Button type="dashed" onClick={handleAddItem} icon={<PlusOutlined />} block>
                Add FAQ
              </Button>
            </S.AddButtonWrapper>

            <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving || uploading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </S.Card>
      </S.Container>

      <FaqItemModal
        open={modalOpen}
        item={editingItem}
        onClose={handleModalCancel}
        onSave={handleModalSave}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default memo(FAQs);