// src/pages/admin/Settings/sections/ClinicInformation/ClinicInformation.jsx
import { memo, useState, useCallback } from "react";
import { Input, Button, Form, message, Skeleton } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { SETTINGS_SECTION_ICONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import SettingsField from "../../../../../components/admin/Settings/SettingsField";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./ClinicInformation.styled";

const ClinicInformation = () => {
  const icon = SETTINGS_SECTION_ICONS.clinicInfo;
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ Individual selectors - stable references
  const clinicInfo = useSettingsStore((state) => state.clinicInfo);
  const loading = useSettingsStore((state) => state.loading);
  const updateClinicInfo = useSettingsStore((state) => state.updateClinicInfo);

  const handleEdit = useCallback(() => {
    form.setFieldsValue({
      name: clinicInfo.name,
      email: clinicInfo.email,
      phone: clinicInfo.phone,
      website: clinicInfo.website,
    });
    setIsEditing(true);
  }, [clinicInfo, form]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateClinicInfo("name", values.name);
      updateClinicInfo("email", values.email);
      updateClinicInfo("phone", values.phone);
      updateClinicInfo("website", values.website);
      message.success("Clinic information updated successfully!");
      setIsEditing(false);
    } catch {
      // Validation error
    } finally {
      setSaving(false);
    }
  }, [form, updateClinicInfo]);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="Clinic Informations" subtitle="Update your clinic's basic informations">
        <S.Container>
          <Skeleton active paragraph={{ rows: 4 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="Clinic Informations" subtitle="Update your clinic's basic informations">
      <S.Container>
        {isEditing ? (
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem>
                  <Form.Item
                    name="name"
                    label="Clinic's Name"
                    rules={[{ required: true, message: "Please enter clinic name" }]}
                  >
                    <Input placeholder="Enter clinic name" size="small" />
                  </Form.Item>
                </S.FieldItem>
                <S.FieldItem>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter email" size="small" />
                  </Form.Item>
                </S.FieldItem>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldItem>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: "Please enter phone number" }]}
                  >
                    <Input placeholder="Enter phone number" size="small" />
                  </Form.Item>
                </S.FieldItem>
                <S.FieldItem>
                  <Form.Item
                    name="website"
                    label="Website"
                    rules={[{ required: false }]}
                  >
                    <Input placeholder="Enter website URL" size="small" />
                  </Form.Item>
                </S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.ActionRow>
              <Button icon={<CloseOutlined />} onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
                style={{
                  background: "#886217",
                  borderColor: "#886217",
                  borderRadius: "5px",
                }}
              >
                Save
              </Button>
            </S.ActionRow>
          </Form>
        ) : (
          <>
            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem>
                  <SettingsField label="Clinic's Name" value={clinicInfo.name} />
                </S.FieldItem>
                <S.FieldItem>
                  <SettingsField label="Email" value={clinicInfo.email} />
                </S.FieldItem>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldItem>
                  <SettingsField label="Phone" value={clinicInfo.phone} />
                </S.FieldItem>
                <S.FieldItem>
                  <SettingsField label="Website" value={clinicInfo.website} />
                </S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.ActionRow>
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{
                  borderRadius: "5px",
                  borderColor: "rgba(0,0,0,0.20)",
                }}
              >
                Edit Information
              </Button>
            </S.ActionRow>
          </>
        )}
      </S.Container>
    </SettingsCard>
  );
};

export default memo(ClinicInformation);