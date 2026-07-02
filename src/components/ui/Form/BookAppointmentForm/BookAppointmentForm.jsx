// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.jsx
import { memo, useEffect } from "react";
import { Form, Input, Select, DatePicker, TimePicker, Button, Alert } from "antd";
import { AiOutlineSend } from "react-icons/ai";
import dayjs from "dayjs";
import * as S from "./BookAppointmentForm.styled";
import SuccessView from "../../SuccessView";
import { useBookAppointmentForm } from "./useBookAppointmentForm";
import Logo from "../../../../assets/images/logo.webp";

const { TextArea } = Input;
const { Option } = Select;

const BookAppointmentForm = () => {
  const [form] = Form.useForm();

  const {
    fields,
    errors,
    loading,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    branchError,
    disabledTime,
    disabledDate,
    isDateFullyBooked,
    handleSubmit,
    handleReset,
    updateFields,
  } = useBookAppointmentForm(form);

  useEffect(() => {
    form.setFieldsValue({
      firstName: fields.firstName,
      middleName: fields.middleName,
      lastName: fields.lastName,
      birthDate: fields.birthDate ? dayjs(fields.birthDate) : null,
      gender: fields.gender || undefined,
      email: fields.email,
      phoneNumber: fields.phoneNumber,
      address: fields.address,
      branchId: fields.branchId || undefined,
      serviceBranchId: fields.serviceBranchId || undefined,
      date: fields.date ? dayjs(fields.date) : null,
      time: fields.time ? dayjs(fields.time, "HH:mm:ss") : null,
      notes: fields.notes,
    });
  }, [fields, form]);

  const handleValuesChange = (changedValues) => {
    const newFields = { ...fields };
    if (changedValues.branchId !== undefined) {
      newFields.branchId = changedValues.branchId;
      newFields.serviceBranchId = "";
      newFields.date = "";
      newFields.time = "";
    }
    if (changedValues.date !== undefined) {
      newFields.date = changedValues.date ? dayjs(changedValues.date).format("YYYY-MM-DD") : "";
      newFields.time = "";
    }
    if (changedValues.time !== undefined) {
      newFields.time = changedValues.time ? changedValues.time.format("HH:mm:ss") : "";
    }
    if (changedValues.serviceBranchId !== undefined) {
      newFields.serviceBranchId = changedValues.serviceBranchId;
    }
    Object.keys(changedValues).forEach(key => {
      if (!['branchId', 'date', 'time', 'serviceBranchId'].includes(key)) {
        newFields[key] = changedValues[key];
      }
    });
    updateFields(newFields);
  };

  const onFinish = async (values) => {
    const submitData = {
      ...values,
      birthDate: values.birthDate ? dayjs(values.birthDate).format("YYYY-MM-DD") : undefined,
      date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
      time: values.time ? values.time.format("HH:mm:ss") : undefined,
    };
    await handleSubmit(submitData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Form validation failed:", errorInfo);
  };

  const formatPhoneDisplay = (value) => {
    if (!value) return '';
    const raw = value.replace(/\D/g, '');
    if (raw.length > 7) {
      return raw.slice(0, 4) + ' ' + raw.slice(4, 7) + ' ' + raw.slice(7);
    }
    if (raw.length > 4) {
      return raw.slice(0, 4) + ' ' + raw.slice(4);
    }
    return raw;
  };

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please enter your mobile number."));
    }
    const stripped = value.replace(/\s/g, '');
    if (!/^(\+63|0)\d{10}$/.test(stripped)) {
      return Promise.reject(new Error("Please enter a valid Philippine mobile number."));
    }
    return Promise.resolve();
  };

  const validateBirthDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please select your birthdate."));
    }
    if (dayjs(value).isAfter(dayjs(), "day")) {
      return Promise.reject(new Error("Birthdate cannot be in the future."));
    }
    return Promise.resolve();
  };

  const validatePreferredDate = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please select your preferred appointment date."));
    }
    if (dayjs(value).isBefore(dayjs(), "day")) {
      return Promise.reject(new Error("Date cannot be in the past."));
    }
    return Promise.resolve();
  };

  const validatePreferredTime = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please select your preferred appointment time."));
    }
    return Promise.resolve();
  };

  if (submitted) {
    return (
      <S.FormCard>
        <SuccessView onReset={handleReset} />
      </S.FormCard>
    );
  }

  return (
    <S.FormCard>
      <S.BrandBlock>
        <S.BrandLogo src={Logo} alt="Leidi Bud Dentals logo" loading="eager" width={100} height={100} />
        <S.BrandName>Leidi Bud Dentals</S.BrandName>
        <S.BrandTagline>Trusted Dental Care</S.BrandTagline>
      </S.BrandBlock>

      <S.BookingFormWrapper>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onValuesChange={handleValuesChange}
          requiredMark={false}
          scrollToFirstError={{ behavior: 'smooth', block: 'center' }}
        >
          {/* ── Personal information ── */}
          <S.FormSection>
            <S.FormSectionTitle>Personal Information</S.FormSectionTitle>
            <S.FieldRow>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Please enter your first name." }]}>
                <Input placeholder="Enter your first name" size="large" />
              </Form.Item>
              <Form.Item name="middleName" label="Middle Name" rules={[{ required: false }]}>
                <Input placeholder="Enter your middle name (optional)" size="large" />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Please enter your last name." }]}>
                <Input placeholder="Enter your last name" size="large" />
              </Form.Item>
            </S.FieldRow>

            <S.FieldRow>
              <Form.Item name="birthDate" label="Birthdate" rules={[{ validator: validateBirthDate }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="MMM D, YYYY"
                  placeholder="Select your birthdate"
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select your gender." }]}>
                <Select placeholder="Select your gender" size="large">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                  <Option value="prefer-not-to-say">Prefer not to say</Option>
                </Select>
              </Form.Item>
            </S.FieldRow>

            <S.FieldGroup>
              <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Please enter a valid email address." }, { required: false }]}>
                <Input placeholder="Enter your email address" size="large" />
              </Form.Item>
              <Form.Item name="phoneNumber" label="Contact Number" rules={[{ validator: validatePhone }]} normalize={(value) => value.replace(/\D/g, '')}>
                <Input
                  placeholder="0912 345 6789"
                  size="large"
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    if (raw.length > 11) {
                      e.preventDefault();
                      return;
                    }
                    e.target.value = formatPhoneDisplay(raw);
                  }}
                />
              </Form.Item>
              <Form.Item name="address" label="Complete Address" rules={[{ required: true, message: "Please enter your complete address." }]}>
                <Input placeholder="Enter your complete address" size="large" />
              </Form.Item>
            </S.FieldGroup>
          </S.FormSection>

          {/* ── Appointment information ── */}
          <S.FormSection>
            <S.FormSectionTitle>Appointment Information</S.FormSectionTitle>
            <S.FieldGroup>
              {/* Branch Dropdown with error display */}
              {branchError && (
                <Alert
                  message="Error loading branches"
                  description={branchError}
                  type="error"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <Form.Item name="branchId" label="Choose Branch" rules={[{ required: true, message: "Please select a branch." }]}>
                <Select placeholder="Select a branch first" loading={branchesLoading} size="large">
                  {branches.map((b) => (
                    <Option key={b.id} value={b.id}>{b.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <S.FieldRow>
                <Form.Item name="date" label="Preferred Date" rules={[{ validator: validatePreferredDate }]}>
                  <DatePicker
                    style={{ width: "100%" }}
                    format="MMM D, YYYY"
                    placeholder="Select your preferred date"
                    disabledDate={disabledDate}
                    disabled={!fields.branchId}
                  />
                </Form.Item>
                <Form.Item
                  name="time"
                  label="Preferred Time"
                  rules={[{ validator: validatePreferredTime }]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    format="h:mm A"
                    use12Hours
                    placeholder={fields.date ? "Select your preferred time" : "Select a date first"}
                    disabledTime={disabledTime}
                    hideDisabledOptions={true}
                    disabled={!fields.branchId || !fields.date}
                    popupStyle={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    popupClassName="time-picker-no-scrollbar"
                  />
                </Form.Item>
              </S.FieldRow>

              {fields.date && isDateFullyBooked && (
                <S.WarningText>This date is fully booked. Please select another date.</S.WarningText>
              )}

              {/* Service Dropdown */}
              <Form.Item name="serviceBranchId" label="Service" rules={[{ required: true, message: "Please select a service." }]}>
                <Select
                  placeholder={fields.branchId ? "Select a service" : "Select a branch first"}
                  loading={servicesLoading}
                  disabled={!fields.branchId || services.length === 0}
                  size="large"
                >
                  {services.map((s) => (
                    <Option key={s.service_branch_id} value={s.service_branch_id}>{s.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="notes" label="Notes / Remarks" rules={[{ required: false }]}>
                <TextArea placeholder="Additional notes (optional)" rows={3} />
              </Form.Item>
            </S.FieldGroup>
          </S.FormSection>

          {errors.form && <S.FormError role="alert">{errors.form}</S.FormError>}

          <S.ButtonWrapper>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading || (fields.date && isDateFullyBooked)}
              icon={!loading && <AiOutlineSend />}
              size="large"
              style={{
                background: "#886217",
                borderColor: "#886217",
                borderRadius: "50px",
                height: "44px",
                padding: "0 32px",
              }}
            >
              {loading ? "Submitting…" : "Book Appointment"}
            </Button>
          </S.ButtonWrapper>
        </Form>
      </S.BookingFormWrapper>
    </S.FormCard>
  );
};

export default memo(BookAppointmentForm);