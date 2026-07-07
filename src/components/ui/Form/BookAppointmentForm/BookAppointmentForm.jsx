// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.jsx
import { memo, useEffect, useMemo } from "react";
import { Form, Input, Select, DatePicker, TimePicker, Button, Alert, Card } from "antd";
import { AiOutlineSend } from "react-icons/ai";
import { UserOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import * as S from "./BookAppointmentForm.styled";
import SuccessView from "../../SuccessView";
import { useBookAppointmentForm } from "./useBookAppointmentForm";
import AvailabilityMessage from "../../AvailabilityMessage";
import Logo from "../../../../assets/images/logo.webp";

const { TextArea } = Input;
const { Option } = Select;

const BookAppointmentForm = () => {
  const [form] = Form.useForm();

  const {
    fields,
    errors,
    isSubmitting,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    disabledTime,
    disabledDate,
    isDateFullyBooked,
    isSelectedDateClosed,
    closureVersion,
    schedulingVersion,
    durationMinutes,
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
    const firstErrorField = errorInfo.errorFields[0]?.name[0];
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
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

  // ── Validation functions ──
  const validatePhone = (_, value) => {
    if (!value) return Promise.reject(new Error("Please enter your mobile number."));
    const stripped = value.replace(/\s/g, '');
    if (!/^(\+63|0)\d{10}$/.test(stripped)) {
      return Promise.reject(new Error("Please enter a valid Philippine mobile number."));
    }
    return Promise.resolve();
  };

  const validateBirthDate = (_, value) => {
    if (!value) return Promise.resolve();
    if (dayjs(value).isAfter(dayjs(), "day")) {
      return Promise.reject(new Error("Birthdate cannot be in the future."));
    }
    return Promise.resolve();
  };

  const validatePreferredDate = (_, value) => {
    if (!value) return Promise.reject(new Error("Please select your preferred appointment date."));
    if (dayjs(value).isBefore(dayjs(), "day")) {
      return Promise.reject(new Error("Date cannot be in the past."));
    }
    return Promise.resolve();
  };

  const validatePreferredTime = (_, value) => {
    if (!value) return Promise.reject(new Error("Please select your preferred appointment time."));
    return Promise.resolve();
  };

  const isDateUnavailable = isSelectedDateClosed || isDateFullyBooked;
  const noServicesAvailable = fields.branchId && !servicesLoading && services.length === 0;

  // ── Summary Card ──
  const showSummary = useMemo(() => {
    return fields.firstName && fields.lastName && fields.phoneNumber && fields.branchId && fields.serviceBranchId && fields.date && fields.time && !isDateUnavailable;
  }, [fields, isDateUnavailable]);

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
          {/* ── Patient Information Section ── */}
          <S.FormSection>
            <S.SectionTitle><UserOutlined /> Patient Information</S.SectionTitle>
            <S.FieldRow>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Please enter your first name." }]}>
                <Input placeholder="Enter first name" size="large" />
              </Form.Item>
              <Form.Item name="middleName" label="Middle Name" rules={[{ required: false }]}>
                <Input placeholder="Enter middle name (optional)" size="large" />
              </Form.Item>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Please enter your last name." }]}>
                <Input placeholder="Enter last name" size="large" />
              </Form.Item>
            </S.FieldRow>

            <S.FieldRow>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select your gender." }]}>
                <Select placeholder="Select your gender" size="large">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                  <Option value="prefer-not-to-say">Prefer not to say</Option>
                </Select>
              </Form.Item>
              <Form.Item name="birthDate" label="Birthdate" rules={[{ validator: validateBirthDate }]}>
                <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" placeholder="Select birthdate (optional)" size="large" />
              </Form.Item>
            </S.FieldRow>

            <Form.Item name="phoneNumber" label="Mobile Number" rules={[{ validator: validatePhone }]}>
              <Input placeholder="0912 345 6789" size="large" onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                if (raw.length > 11) return;
                e.target.value = formatPhoneDisplay(raw);
              }} />
            </Form.Item>

            <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Please enter a valid email address." }, { required: false }]}>
              <Input placeholder="Enter email (optional)" size="large" />
            </Form.Item>

            <Form.Item name="address" label="Address" rules={[{ required: false }]}>
              <Input placeholder="Enter address (optional)" size="large" />
            </Form.Item>
          </S.FormSection>

          {/* ── Appointment Information Section ── */}
          <S.FormSection>
            <S.SectionTitle><CalendarOutlined /> Appointment Information</S.SectionTitle>
            <Form.Item name="branchId" label="Branch" rules={[{ required: true, message: "Please select a branch." }]}>
              <Select placeholder="Select a branch" loading={branchesLoading} size="large">
                {branches.map((b) => <Option key={b.id} value={b.id}>{b.name}</Option>)}
              </Select>
            </Form.Item>

            <S.FieldRow>
              <Form.Item name="date" label="Appointment Date" rules={[{ validator: validatePreferredDate }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="MMM D, YYYY"
                  placeholder="Select preferred date"
                  disabledDate={disabledDate}
                  disabled={!fields.branchId}
                  onPanelChange={(value, mode) => {
                    if (mode === 'date') {
                      // handled by hook
                    }
                  }}
                  key={`datepicker-${fields.branchId}-${closureVersion}`}
                  size="large"
                />
              </Form.Item>

              {fields.date && isDateUnavailable ? (
                <S.FullWidth>
                  <AvailabilityMessage isClosed={isSelectedDateClosed} isFullyBooked={isDateFullyBooked} />
                </S.FullWidth>
              ) : (
                <Form.Item
                  name="time"
                  label="Appointment Time"
                  rules={[{ validator: validatePreferredTime }]}
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    format="h:mm A"
                    use12Hours
                    placeholder={fields.date ? "Select preferred time" : "Select a date first"}
                    disabledTime={disabledTime}
                    minuteStep={1}
                    hideDisabledOptions={true}
                    disabled={!fields.branchId || !fields.date}
                    popupStyle={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    popupClassName="time-picker-no-scrollbar"
                    key={`timepicker-${fields.branchId}-${fields.date}-${durationMinutes}-${closureVersion}-${schedulingVersion}`}
                  />
                </Form.Item>
              )}
            </S.FieldRow>

            {noServicesAvailable ? (
              <S.FullWidth>
                <Alert
                  type="info"
                  showIcon
                  message="No services available for online booking"
                  description="This branch does not currently offer any services that can be booked online. Please contact the clinic for assistance."
                  style={{ marginBottom: 16 }}
                />
              </S.FullWidth>
            ) : (
              <Form.Item
                name="serviceBranchId"
                label="Service"
                rules={[{ required: true, message: "Please select a service." }]}
              >
                <Select
                  placeholder={fields.branchId ? "Select a service" : "Select a branch first"}
                  loading={servicesLoading}
                  disabled={!fields.branchId || services.length === 0 || isDateUnavailable}
                  size="large"
                >
                  {services.map((s) => <Option key={s.service_branch_id} value={s.service_branch_id}>{s.name || "Unnamed"}</Option>)}
                </Select>
              </Form.Item>
            )}
          </S.FormSection>

          {/* ── Additional Information Section ── */}
          <S.FormSection>
            <S.SectionTitle><FileTextOutlined /> Additional Information</S.SectionTitle>
            <Form.Item name="notes" label="Notes / Remarks" rules={[{ required: false }]}>
              <TextArea placeholder="Additional notes (optional)" rows={3} />
            </Form.Item>
          </S.FormSection>

          {/* ── Summary Card ── */}
          {showSummary && (
            <S.SummaryCard>
              <Card title="Appointment Summary" size="small" bordered={false}>
                <S.SummaryGrid>
                  <S.SummaryItem><strong>Branch:</strong> {branches.find(b => b.id === fields.branchId)?.name}</S.SummaryItem>
                  <S.SummaryItem><strong>Service:</strong> {services.find(s => s.service_branch_id === fields.serviceBranchId)?.name}</S.SummaryItem>
                  <S.SummaryItem><strong>Date:</strong> {dayjs(fields.date).format('MMMM D, YYYY')}</S.SummaryItem>
                  <S.SummaryItem><strong>Time:</strong> {dayjs(fields.time, 'HH:mm:ss').format('h:mm A')}</S.SummaryItem>
                  <S.SummaryItem><strong>Patient:</strong> {fields.firstName} {fields.lastName}</S.SummaryItem>
                  <S.SummaryItem><strong>Contact:</strong> {fields.phoneNumber}</S.SummaryItem>
                </S.SummaryGrid>
              </Card>
            </S.SummaryCard>
          )}

          {errors.form && <S.FormError role="alert">{errors.form}</S.FormError>}

          <S.ButtonWrapper>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting || (fields.date && isDateUnavailable)}
              icon={!isSubmitting && <AiOutlineSend />}
              size="large"
              style={{
                background: "#886217",
                borderColor: "#886217",
                borderRadius: "50px",
                height: "44px",
                padding: "0 32px",
                width: "100%",
              }}
            >
              {isSubmitting ? "Submitting…" : "Book Appointment"}
            </Button>
          </S.ButtonWrapper>
        </Form>
      </S.BookingFormWrapper>
    </S.FormCard>
  );
};

export default memo(BookAppointmentForm);