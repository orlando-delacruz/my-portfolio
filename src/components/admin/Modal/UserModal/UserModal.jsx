// src/components/admin/Modal/UserModal/UserModal.jsx
import { memo, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, Upload, Alert, Checkbox } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { uploadAvatar } from '../../../../services/storage';
import { createAdminUser, updateAdmin, updateAdminPassword } from '../../../../services/admins';
import * as S from './UserModal.styled';

const { Option } = Select;

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'dentist', label: 'Dentist' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

const UserModal = memo(({ open, user, onClose, onSave, loading }) => {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    if (open) {
      if (user) {
        form.setFieldsValue({
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          phone_number: user.phone_number,
          role: user.role,
          status: user.status,
          avatar_url: user.avatar_url,
        });
        if (user.avatar_url) setAvatarPreview(user.avatar_url);
        setChangePassword(false);
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'active' });
        setAvatarPreview(null);
        setAvatarFile(null);
        setChangePassword(false);
      }
      setAvatarError(null);
    }
  }, [open, user, form]);

  const handleUpload = async (file) => {
    setAvatarError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    } catch (err) {
      setAvatarError(err.message || 'Failed to process image.');
    }
    return false;
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    form.setFieldsValue({ avatar_url: null });
    setAvatarError(null);
  };

  const handleFinish = async (values) => {
    setSubmitting(true);
    setAvatarError(null);

    try {
      let avatarUrl = values.avatar_url || null;

      if (avatarFile) {
        setAvatarLoading(true);
        try {
          const userId = user?.id || 'new-user';
          avatarUrl = await uploadAvatar(avatarFile, userId);
        } catch (uploadErr) {
          setAvatarError(uploadErr.message || 'Avatar upload failed');
          setAvatarLoading(false);
          setSubmitting(false);
          return;
        } finally {
          setAvatarLoading(false);
        }
      }

      const payload = {
        full_name: values.full_name,
        username: values.username,
        email: values.email,
        phone_number: values.phone_number || null,
        role: values.role,
        status: values.status,
        avatar_url: avatarUrl,
      };

      if (user) {
        await updateAdmin(user.id, payload);
        if (changePassword && values.newPassword) {
          const authUserId = user.auth_user_id || null;
          if (!authUserId) {
            setAvatarError(
              'This user is not linked to an authentication account. ' +
              'Please contact support to fix this issue.'
            );
            setSubmitting(false);
            return;
          }
          await updateAdminPassword(authUserId, values.newPassword);
        }
        onSave(payload);
      } else {
        const createPayload = {
          ...payload,
          password: values.password,
          login_method: 'password',
        };
        await createAdminUser(createPayload);
        onSave(createPayload);
      }
    } catch (err) {
      console.error('Save error:', err);
      setAvatarError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      handleUpload(file);
      return false;
    },
    showUploadList: false,
    accept: 'image/*',
  };

  const isAvatarUploading = avatarLoading;
  const isFormSubmitting = submitting || loading;

  return (
    <Modal
      open={open}
      title={user ? 'Edit User' : 'Add User'}
      onCancel={onClose}
      width={640}
      footer={null}
      destroyOnHidden
      styles={{
        body: { paddingTop: 8 },
        content: { borderRadius: '16px' },
      }}
      className="user-modal"
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Avatar">
              <S.AvatarUploadWrapper>
                <S.AvatarPreview>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <div className="placeholder">No avatar</div>
                  )}
                </S.AvatarPreview>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Upload {...uploadProps} disabled={isAvatarUploading}>
                    <Button
                      icon={<UploadOutlined />}
                      loading={isAvatarUploading}
                      disabled={isAvatarUploading}
                    >
                      {isAvatarUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </Upload>
                  {avatarPreview && (
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={handleRemoveAvatar}
                      disabled={isAvatarUploading}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {avatarError && <Alert type="error" title={avatarError} style={{ marginTop: 8 }} />}
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                  Supported: JPG, PNG, WebP, GIF (Max 10MB)
                </div>
              </S.AvatarUploadWrapper>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email.' },
                { type: 'email', message: 'Invalid email address.' },
              ]}
            >
              <Input placeholder="user@example.com" size="large" disabled={!!user} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter full name.' }]}
            >
              <Input placeholder="Full Name" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: 'Please enter username.' }]}
            >
              <Input placeholder="Username" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Login Method">
              <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4, fontSize: 14 }}>
                {user ? user.login_method || 'Password' : 'Password'}
              </div>
            </Form.Item>
          </Col>
        </Row>

        {!user && (
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please enter password.' },
                  { min: 8, message: 'Password must be at least 8 characters.' },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Enter password"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm password.' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match.'));
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="Confirm password"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {user && (
          <>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item>
                  <Checkbox
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                  >
                    Change Password
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            {changePassword && (
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="newPassword"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter new password.' },
                      { min: 8, message: 'Password must be at least 8 characters.' },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="Enter new password"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    dependencies={['newPassword']}
                    rules={[
                      { required: true, message: 'Please confirm new password.' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match.'));
                        },
                      }),
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="Confirm new password"
                      size="large"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </>
        )}

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item name="phone_number" label="Phone Number">
              <Input placeholder="+63 912 345 6789" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select a role.' }]}
            >
              <Select placeholder="Select role" size="large">
                {ROLE_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select a status.' }]}
            >
              <Select placeholder="Select status" size="large">
                {STATUS_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <S.FooterRow>
          <S.CancelBtn onClick={onClose} disabled={isFormSubmitting || isAvatarUploading}>
            Cancel
          </S.CancelBtn>
          <Button
            type="primary"
            htmlType="submit"
            loading={isFormSubmitting || isAvatarUploading}
            size="large"
            disabled={isFormSubmitting || isAvatarUploading}
            style={{ borderRadius: '8px' }}
          >
            {user ? 'Update' : 'Create'}
          </Button>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

export default memo(UserModal);