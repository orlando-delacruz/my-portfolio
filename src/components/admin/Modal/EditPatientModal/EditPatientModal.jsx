// src/components/admin/Modal/EditPatientModal/EditPatientModal.jsx
import { memo, useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';
import { useBranches } from '../../../../hooks/useBranches';
import { getRawPhoneDigits, formatPhoneDisplay, isValidPhilippinePhone } from '../../../../utils/phoneFormatter';
import * as S from './EditPatientModal.styled';

const { Option } = Select;

const EditPatientModal = memo(({ open, patient, loading, onClose, onSave }) => {
  const [form] = Form.useForm();
  const { branches, loading: branchesLoading } = useBranches();
  const [isOrthodontic, setIsOrthodontic] = useState(false);
  const watchIsOrthodontic = Form.useWatch('isOrthodontic', form);

  useEffect(() => {
    if (open && patient) {
      const ortho = patient.is_orthodontic || false;
      setIsOrthodontic(ortho);
      form.setFieldsValue({
        firstName: patient.first_name || '',
        middleName: patient.middle_name || '',
        lastName: patient.last_name || '',
        phoneNumber: patient.phone_number ? formatPhoneDisplay(patient.phone_number) : '',
        email: patient.email || '',
        birthDate: patient.birth_date ? dayjs(patient.birth_date) : null,
        gender: patient.gender || '',
        address: patient.address || '',
        isOrthodontic: ortho,
        branchId: patient.branch_id || null,
      });
    }
  }, [open, patient, form]);

  useEffect(() => {
    // When orthodontic checkbox changes, show/hide branch field
    if (watchIsOrthodontic !== undefined) {
      setIsOrthodontic(watchIsOrthodontic);
    }
  }, [watchIsOrthodontic]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const phoneDigits = getRawPhoneDigits(values.phoneNumber);
      await onSave({
        ...values,
        phoneNumber: phoneDigits,
        isOrthodontic: values.isOrthodontic || false,
        branchId: values.isOrthodontic ? values.branchId : null,
      });
    } catch {
      // Validation failed
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handlePhoneChange = (e) => {
    const raw = getRawPhoneDigits(e.target.value);
    if (raw.length > 11) {
      e.preventDefault();
      return;
    }
    const formatted = formatPhoneDisplay(raw);
    form.setFieldValue('phoneNumber', formatted);
  };

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Contact number is required.'));
    }
    const stripped = getRawPhoneDigits(value);
    if (!isValidPhilippinePhone(stripped)) {
      return Promise.reject(new Error('Enter a valid PH number (e.g., 0912 345 6789).'));
    }
    return Promise.resolve();
  };

  const validateBirthDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please select birthdate.'));
    }
    if (dayjs(value).isAfter(dayjs(), 'day')) {
      return Promise.reject(new Error('Birthdate cannot be in the future.'));
    }
    return Promise.resolve();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={<S.ModalTitle>Edit Patient</S.ModalTitle>}
      width={680}
      centered
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <S.FormGrid>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'First name is required.' }]}
          >
            <Input placeholder="Enter first name" maxLength={80} />
          </Form.Item>

          <Form.Item
            name="middleName"
            label="Middle Name"
            rules={[{ required: false }]}
          >
            <Input placeholder="(Optional)" maxLength={80} />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Last name is required.' }]}
          >
            <Input placeholder="Enter last name" maxLength={80} />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Contact Number"
            rules={[{ validator: validatePhone }]}
          >
            <Input
              placeholder="0912 345 6789"
              maxLength={16}
              onChange={handlePhoneChange}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { type: 'email', message: 'Enter a valid email address.' },
              { required: false },
            ]}
          >
            <Input placeholder="Enter email (optional)" maxLength={256} />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Birthdate"
            rules={[{ validator: validateBirthDate }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="MMM D, YYYY"
              placeholder="Select birthdate"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender.' }]}
          >
            <Select placeholder="Select gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
              <Option value="prefer-not-to-say">Prefer not to say</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Complete Address"
            rules={[{ required: true, message: 'Address is required.' }]}
          >
            <Input placeholder="Enter complete address" />
          </Form.Item>

          <S.FullWidth>
            <Form.Item name="isOrthodontic" valuePropName="checked">
              <Checkbox>Orthodontic Patient</Checkbox>
            </Form.Item>
          </S.FullWidth>

          {isOrthodontic && (
            <S.FullWidth>
              <Form.Item
                name="branchId"
                label="Assigned Branch"
                rules={[{ required: true, message: 'Please select a branch.' }]}
              >
                <Select placeholder="Select assigned branch" loading={branchesLoading}>
                  {branches.map((b) => (
                    <Option key={b.id} value={b.id}>{b.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </S.FullWidth>
          )}
        </S.FormGrid>
      </Form>

      <S.FooterRow>
        <S.CancelBtn onClick={handleCancel} type="button">
          Cancel
        </S.CancelBtn>
        <S.SaveBtn onClick={handleOk} disabled={loading} type="button">
          {loading ? 'Saving…' : 'Save'}
        </S.SaveBtn>
      </S.FooterRow>
    </Modal>
  );
});

EditPatientModal.displayName = 'EditPatientModal';
export default EditPatientModal;