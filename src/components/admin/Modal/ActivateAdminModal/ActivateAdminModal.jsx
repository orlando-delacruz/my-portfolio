// src/components/admin/Modal/ActivateAdminModal/ActivateAdminModal.jsx
import { memo, useState } from 'react';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import * as S from './ActivateAdminModal.styled';

const ActivateAdminModal = memo(({ open, admin, onClose, onActivate, loading }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState(null);

  const handleFinish = async (values) => {
    setError(null);
    try {
      await onActivate(admin.id, values.password);
    } catch (err) {
      setError(err.message || 'Activation failed.');
    }
  };

  return (
    <Modal
      open={open}
      title={`Activate Administrator – ${admin?.full_name || admin?.email || ''}`}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter a password.' },
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
        {error && <Alert type="error" title={error} style={{ marginBottom: 16 }} />}
        <S.FooterRow>
          <S.CancelBtn onClick={onClose}>Cancel</S.CancelBtn>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            Activate
          </Button>
        </S.FooterRow>
      </Form>
    </Modal>
  );
});

export default ActivateAdminModal;