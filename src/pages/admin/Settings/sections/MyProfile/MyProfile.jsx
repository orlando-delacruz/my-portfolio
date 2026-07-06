// src/pages/admin/Settings/sections/MyProfile/MyProfile.jsx
import { memo, useState, useCallback } from "react";
import { Input, Button, Form, message, Avatar, Upload, Skeleton } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined, UserOutlined, CameraOutlined } from "@ant-design/icons";
import { SETTINGS_SECTION_ICONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import SettingsField from "../../../../../components/admin/Settings/SettingsField";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./MyProfile.styled";

const MyProfile = () => {
  const icon = SETTINGS_SECTION_ICONS.profile;
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // ✅ Individual selectors - stable references
  const profile = useSettingsStore((state) => state.profile);
  const loading = useSettingsStore((state) => state.loading);
  const updateProfile = useSettingsStore((state) => state.updateProfile);
  const googleLogin = useSettingsStore((state) => state.googleLogin);
  const toggleGoogleLogin = useSettingsStore((state) => state.toggleGoogleLogin);

  const handleEdit = useCallback(() => {
    form.setFieldsValue({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
    });
    setIsEditing(true);
  }, [profile, form]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setAvatarFile(null);
    form.resetFields();
  }, [form]);

  const handleSave = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      updateProfile("fullName", values.fullName);
      updateProfile("email", values.email);
      updateProfile("phone", values.phone);
      if (avatarFile) {
        updateProfile("avatarUrl", URL.createObjectURL(avatarFile));
      }
      message.success("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch {
      // Validation error
    } finally {
      setSaving(false);
    }
  }, [form, updateProfile, avatarFile]);

  const handleAvatarChange = useCallback((file) => {
    setAvatarFile(file);
    return false;
  }, []);

  const handleDisconnectGoogle = useCallback(() => {
    toggleGoogleLogin();
    message.info("Google account disconnected.");
  }, [toggleGoogleLogin]);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="My Profile" subtitle="Manage your personal information and account" variant="highlighted">
        <S.Container>
          <Skeleton active avatar paragraph={{ rows: 6 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="My Profile" subtitle="Manage your personal information and account" variant="highlighted">
      <S.Container>
        <S.AvatarSection>
          <S.AvatarWrapper>
            <Avatar
              size={100}
              src={avatarFile ? URL.createObjectURL(avatarFile) : profile.avatarUrl}
              icon={<UserOutlined />}
              style={{ background: "#D8C6A5", width: 100, height: 100 }}
            />
            {isEditing && (
              <S.AvatarUploadBtn>
                <Upload
                  beforeUpload={handleAvatarChange}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button
                    icon={<CameraOutlined />}
                    shape="circle"
                    size="small"
                    style={{
                      background: "rgba(0,0,0,0.20)",
                      border: "1px solid white",
                      color: "white",
                    }}
                  />
                </Upload>
              </S.AvatarUploadBtn>
            )}
          </S.AvatarWrapper>
        </S.AvatarSection>

        {isEditing ? (
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem>
                  <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: "Please enter full name" }]}>
                    <Input placeholder="Enter full name" size="small" />
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
                  <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter phone number" }]}>
                    <Input placeholder="Enter phone number" size="small" />
                  </Form.Item>
                </S.FieldItem>
                <S.FieldItem>
                  <Form.Item label="Password">
                    <S.PasswordDisplay>
                      <span>••••••</span>
                      <Button
                        size="small"
                        style={{
                          borderRadius: "5px",
                          borderColor: "rgba(0,0,0,0.20)",
                          fontSize: "10px",
                          padding: "0 8px",
                          height: "22px",
                        }}
                      >
                        Change
                      </Button>
                    </S.PasswordDisplay>
                  </Form.Item>
                </S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.ActionRow>
              <Button icon={<CloseOutlined />} onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving} style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}>
                Save Profile
              </Button>
            </S.ActionRow>
          </Form>
        ) : (
          <>
            <S.FieldGroup>
              <S.FieldRow>
                <S.FieldItem><SettingsField label="Full Name" value={profile.fullName} /></S.FieldItem>
                <S.FieldItem><SettingsField label="Email" value={profile.email} /></S.FieldItem>
              </S.FieldRow>
              <S.FieldRow>
                <S.FieldItem><SettingsField label="Phone Number" value={profile.phone} /></S.FieldItem>
                <S.FieldItem><SettingsField label="Password" value="••••••" /></S.FieldItem>
              </S.FieldRow>
            </S.FieldGroup>

            <S.GoogleSection>
              <S.GoogleLeft>
                <S.GoogleIconWrapper>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                  </svg>
                </S.GoogleIconWrapper>
                <S.GoogleText>
                  <S.GoogleTitle>Google Login</S.GoogleTitle>
                  <S.GoogleStatus $connected={googleLogin.connected}>
                    {googleLogin.connected ? "Connected" : "Disconnected"}
                  </S.GoogleStatus>
                </S.GoogleText>
              </S.GoogleLeft>
              <Button
                danger={googleLogin.connected}
                onClick={handleDisconnectGoogle}
                style={{
                  borderRadius: "5px",
                  background: googleLogin.connected ? "rgba(247, 19, 19, 0.20)" : "transparent",
                  borderColor: googleLogin.connected ? "rgba(247, 19, 19, 0.20)" : "rgba(0,0,0,0.20)",
                  color: googleLogin.connected ? "#F81313" : "#222",
                  fontSize: "12px",
                  padding: "4px 12px",
                  height: "auto",
                }}
              >
                {googleLogin.connected ? "Disconnect" : "Connect"}
              </Button>
            </S.GoogleSection>

            <S.ActionRow>
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}>
                Edit Profile
              </Button>
            </S.ActionRow>
          </>
        )}
      </S.Container>
    </SettingsCard>
  );
};

export default memo(MyProfile);