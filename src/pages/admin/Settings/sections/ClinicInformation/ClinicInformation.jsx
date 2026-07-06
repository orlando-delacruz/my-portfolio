// src/pages/admin/Settings/sections/ClinicInformation/ClinicInformation.jsx
import { memo, useState, useCallback } from "react";
import { Input, Button, Form, message, Skeleton } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, UploadOutlined } from "@ant-design/icons";
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
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Individual selectors
  const clinicInfo = useSettingsStore((state) => state.clinicInfo);
  const loading = useSettingsStore((state) => state.loading);
  const updateClinicInfo = useSettingsStore((state) => state.updateClinicInfo);
  const uploadLogo = useSettingsStore((state) => state.uploadLogo);
  const isSaving = useSettingsStore((state) => state.isSaving);

  const handleEdit = useCallback(() => {
    form.setFieldsValue({
      name: clinicInfo?.name || "",
      email: clinicInfo?.email || "",
      phone: clinicInfo?.phone || "",
      website: clinicInfo?.website || "",
    });
    setLogoPreview(clinicInfo?.logoUrl || null);
    setLogoFile(null);
    setIsEditing(true);
  }, [clinicInfo, form]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setLogoFile(null);
    setLogoPreview(null);
    form.resetFields();
  }, [form]);

  const handleLogoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error("Logo must be smaller than 5MB");
        return;
      }
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(file.type)) {
        message.error("Please upload a JPEG, PNG, WebP, or GIF image");
        return;
      }
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoFile(null);
    setLogoPreview(null);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Update clinic info
      await updateClinicInfo({
        name: values.name,
        email: values.email,
        phone: values.phone,
        website: values.website,
      });

      // Upload logo if changed
      if (logoFile) {
        await uploadLogo(logoFile);
      }

      message.success("Clinic information updated successfully!");
      setIsEditing(false);
      setLogoFile(null);
      setLogoPreview(null);
    } catch (err) {
      if (err?.errorFields) {
        // Form validation error
        return;
      }
      message.error(err?.message || "Failed to update clinic information");
    } finally {
      setSaving(false);
    }
  }, [form, updateClinicInfo, uploadLogo, logoFile]);

  if (loading && !clinicInfo) {
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
            {/* Logo upload */}
            <S.LogoSection>
              <S.LogoPreview>
                {logoPreview ? (
                  <img src={logoPreview} alt="Clinic logo" />
                ) : (
                  <S.LogoPlaceholder>No logo</S.LogoPlaceholder>
                )}
              </S.LogoPreview>
              <S.LogoActions>
                <Button icon={<UploadOutlined />} onClick={() => document.getElementById("logo-input")?.click()}>
                  Upload Logo
                </Button>
                {logoPreview && (
                  <Button danger onClick={handleRemoveLogo}>
                    Remove
                  </Button>
                )}
                <input
                  id="logo-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }}
                  onChange={handleLogoChange}
                />
              </S.LogoActions>
            </S.LogoSection>

            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem>
                  <Form.Item name="name" label="Clinic's Name" rules={[{ required: true, message: "Please enter clinic name" }]}>
                    <Input placeholder="Enter clinic name" size="small" />
                  </Form.Item>
                </S.FieldItem>
                <S.FieldItem>
                  <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }]}>
                    <Input placeholder="Enter email" size="small" />
                  </Form.Item>
                </S.FieldItem>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldItem>
                  <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number" }]}>
                    <Input placeholder="Enter phone number" size="small" />
                  </Form.Item>
                </S.FieldItem>
                <S.FieldItem>
                  <Form.Item name="website" label="Website" rules={[{ required: false }]}>
                    <Input placeholder="Enter website URL" size="small" />
                  </Form.Item>
                </S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.ActionRow>
              <Button icon={<CloseOutlined />} onClick={handleCancel} disabled={saving || isSaving}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving || isSaving}
                style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}
              >
                Save
              </Button>
            </S.ActionRow>
          </Form>
        ) : (
          <>
            {/* Logo display */}
            <S.LogoDisplay>
              {clinicInfo?.logoUrl ? (
                <img src={clinicInfo.logoUrl} alt="Clinic logo" />
              ) : (
                <span>No logo uploaded</span>
              )}
            </S.LogoDisplay>

            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem>
                  <SettingsField label="Clinic's Name" value={clinicInfo?.name || "—"} />
                </S.FieldItem>
                <S.FieldItem>
                  <SettingsField label="Email" value={clinicInfo?.email || "—"} />
                </S.FieldItem>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldItem>
                  <SettingsField label="Phone" value={clinicInfo?.phone || "—"} />
                </S.FieldItem>
                <S.FieldItem>
                  <SettingsField label="Website" value={clinicInfo?.website || "—"} />
                </S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.ActionRow>
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                style={{ borderRadius: "5px", borderColor: "rgba(0,0,0,0.20)" }}
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