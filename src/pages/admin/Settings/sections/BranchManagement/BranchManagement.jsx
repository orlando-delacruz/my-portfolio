// src/pages/admin/Settings/sections/BranchManagement/BranchManagement.jsx
import { memo, useState, useCallback } from "react";
import { Button, Modal, Form, Input, message, Empty, Skeleton } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { SETTINGS_SECTION_ICONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./BranchManagement.styled";

const { confirm } = Modal;

const BranchManagement = () => {
  const icon = SETTINGS_SECTION_ICONS.branches;
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [saving, setSaving] = useState(false);

  const branches = useSettingsStore((state) => state.branches);
  const loading = useSettingsStore((state) => state.loading);
  const addBranch = useSettingsStore((state) => state.addBranch);
  const updateBranch = useSettingsStore((state) => state.updateBranch);
  const deleteBranch = useSettingsStore((state) => state.deleteBranch);
  const isSaving = useSettingsStore((state) => state.isSaving);

  const handleAddNew = useCallback(() => {
    setEditingBranch(null);
    form.resetFields();
    setModalOpen(true);
  }, [form]);

  const handleEdit = useCallback((branch) => {
    setEditingBranch(branch);
    form.setFieldsValue({
      name: branch.name,
      address: branch.address,
    });
    setModalOpen(true);
  }, [form]);

  const handleDelete = useCallback((branch) => {
    confirm({
      title: `Delete "${branch.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone. All data associated with this branch will be removed.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteBranch(branch.id);
          message.success("Branch deleted successfully.");
        } catch (err) {
          message.error(err?.message || "Failed to delete branch.");
        }
      },
    });
  }, [deleteBranch]);

  const handleModalCancel = useCallback(() => {
    setModalOpen(false);
    setEditingBranch(null);
    form.resetFields();
  }, [form]);

  const handleModalSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingBranch) {
        await updateBranch(editingBranch.id, values);
        message.success("Branch updated successfully!");
      } else {
        await addBranch(values);
        message.success("Branch added successfully!");
      }
      setModalOpen(false);
      setEditingBranch(null);
      form.resetFields();
    } catch (err) {
      if (err?.errorFields) return;
      message.error(err?.message || "Failed to save branch.");
    } finally {
      setSaving(false);
    }
  }, [form, editingBranch, addBranch, updateBranch]);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="Branch Management" subtitle="Manage your clinic branches">
        <S.Container>
          <Skeleton active paragraph={{ rows: 4 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <>
      <SettingsCard icon={icon} title="Branch Management" subtitle="Manage your clinic branches">
        <S.Container>
          <S.BranchList>
            {branches.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No branches added yet" style={{ padding: "20px 0" }} />
            ) : (
              branches.map((branch) => (
                <S.BranchItem key={branch.id}>
                  <S.BranchInfo>
                    <S.BranchName>{branch.name}</S.BranchName>
                    <S.BranchAddress>{branch.address || "—"}</S.BranchAddress>
                  </S.BranchInfo>
                  <S.BranchActions>
                    <Button
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => handleEdit(branch)}
                      style={{
                        borderRadius: "5px",
                        borderColor: "rgba(136, 98, 23, 0.20)",
                        fontSize: "10px",
                        padding: "4px 12px",
                        height: "auto",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={() => handleDelete(branch)}
                      style={{
                        borderRadius: "5px",
                        fontSize: "10px",
                        padding: "4px 12px",
                        height: "auto",
                      }}
                    />
                  </S.BranchActions>
                </S.BranchItem>
              ))
            )}
          </S.BranchList>

          <S.AddButtonWrapper>
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddNew}
              style={{
                width: "100%",
                borderRadius: "5px",
                borderColor: "rgba(136, 98, 23, 0.20)",
                color: "#886217",
                padding: "6px 0",
                height: "auto",
                fontSize: "14px",
                justifyContent: "center",
              }}
            >
              Add New Branch
            </Button>
          </S.AddButtonWrapper>
        </S.Container>
      </SettingsCard>

      <Modal
        open={modalOpen}
        title={editingBranch ? "Edit Branch" : "Add New Branch"}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel} disabled={saving || isSaving}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={handleModalSave}
            loading={saving || isSaving}
            style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}
          >
            {editingBranch ? "Update" : "Add"}
          </Button>,
        ]}
        width={480}
        styles={{
          content: { borderRadius: "12px" },
          header: { borderBottom: "1px solid #f0f0f0", paddingBottom: "16px" },
          body: { paddingTop: "20px" },
        }}
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item name="name" label="Branch Name" rules={[{ required: true, message: "Please enter branch name." }]}>
            <Input placeholder="Enter branch name" style={{ borderRadius: "5px" }} />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Please enter branch address." }]}>
            <Input placeholder="Enter branch address" style={{ borderRadius: "5px" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(BranchManagement);