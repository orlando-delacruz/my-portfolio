// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.jsx
import { memo, useCallback } from "react";
import { AiOutlineSend } from "react-icons/ai";
import dayjs from "dayjs";
import * as S from "./BookAppointmentForm.styled";
import { TextField, SelectField } from "../../Fields";
import SuccessView from "../../SuccessView";
import { useBookAppointmentForm } from "./useBookAppointmentForm";
import Logo from "../../../../assets/images/logo.webp";

const BookAppointmentForm = () => {
  const {
    fields,
    errors,
    loading,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    disabledTime,
    disabledDate,
    handleChange,
    handleBranchChange,
    handleDateChange,
    handleTimeChange,
    handleBirthDateChange,
    handleSubmit,
    handleReset,
    setFields,
    setErrors,
  } = useBookAppointmentForm();

  // Format phone number as "0912 345 6789"
  const formatPhoneDisplay = (digits) => {
    if (!digits) return '';
    const raw = digits.replace(/\D/g, '');
    if (raw.length > 7) {
      return raw.slice(0, 4) + ' ' + raw.slice(4, 7) + ' ' + raw.slice(7);
    }
    if (raw.length > 4) {
      return raw.slice(0, 4) + ' ' + raw.slice(4);
    }
    return raw;
  };

  const handlePhoneChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 11) return;
    setFields((prev) => ({ ...prev, phoneNumber: raw }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
  }, [setFields, setErrors, errors.phoneNumber]);

  if (submitted) {
    return (
      <S.FormCard>
        <SuccessView onReset={handleReset} />
      </S.FormCard>
    );
  }

  return (
    <S.FormCard>
      {/* Clinic brand */}
      <S.BrandBlock>
        <S.BrandLogo src={Logo} alt="Leidi Bud Dentals logo" loading="eager" width={100} height={100} />
        <S.BrandName>Leidi Bud Dentals</S.BrandName>
        <S.BrandTagline>Trusted Dental Care</S.BrandTagline>
      </S.BrandBlock>

      <form onSubmit={handleSubmit} noValidate aria-label="Book an appointment">
        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
          {/* ── Personal information ── */}
          <S.FormSection aria-labelledby="personal-section-title">
            <S.FormSectionTitle id="personal-section-title">
              Personal Information
            </S.FormSectionTitle>

            <S.FieldRow>
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                placeholder="Juan"
                value={fields.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <TextField
                id="middleName"
                name="middleName"
                label="Middle Name"
                placeholder="(Optional)"
                value={fields.middleName}
                onChange={handleChange}
                error={errors.middleName}
              />
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                placeholder="Dela Cruz"
                value={fields.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </S.FieldRow>

            <S.FieldRow>
              <S.FieldGroup>
                <S.FieldLabel htmlFor="birthDate">Birthdate</S.FieldLabel>
                <S.StyledDatePicker
                  id="birthDate"
                  style={{ width: "100%" }}
                  format="MMM D, YYYY"
                  placeholder="Select birthdate"
                  value={fields.birthDate ? dayjs(fields.birthDate) : null}
                  onChange={handleBirthDateChange}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                  aria-required="true"
                  aria-invalid={!!errors.birthDate}
                />
                {errors.birthDate && <S.ErrorText>{errors.birthDate}</S.ErrorText>}
              </S.FieldGroup>
              <SelectField
                id="gender"
                name="gender"
                label="Gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                  { value: "prefer-not-to-say", label: "Prefer not to say" },
                ]}
                value={fields.gender}
                onChange={handleChange}
                placeholder="Select"
                error={errors.gender}
              />
            </S.FieldRow>

            <S.FieldGroup>
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                value={fields.email}
                onChange={handleChange}
                error={errors.email}
              />
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Contact Number"
                type="tel"
                placeholder="0912 345 6789"
                value={formatPhoneDisplay(fields.phoneNumber)}
                onChange={handlePhoneChange}
                error={errors.phoneNumber}
                required
              />
              <TextField
                id="address"
                name="address"
                label="Complete Address"
                placeholder="123 Street, City, Province"
                value={fields.address}
                onChange={handleChange}
                error={errors.address}
              />
            </S.FieldGroup>
          </S.FormSection>

          {/* ── Appointment information ── */}
          <S.FormSection aria-labelledby="appointment-section-title">
            <S.FormSectionTitle id="appointment-section-title">
              Appointment Information
            </S.FormSectionTitle>

            <S.FieldGroup>
              <SelectField
                id="branchId"
                name="branchId"
                label="Choose Branch"
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                value={fields.branchId}
                onChange={handleBranchChange}
                placeholder="Select a branch"
                error={errors.branchId}
                loading={branchesLoading}
                required
              />

              <S.FieldRow>
                <S.FieldGroup>
                  <S.FieldLabel htmlFor="date">Preferred Date</S.FieldLabel>
                  <S.StyledDatePicker
                    id="date"
                    style={{ width: "100%" }}
                    format="MMM D, YYYY"
                    placeholder="Select date"
                    value={fields.date ? dayjs(fields.date) : null}
                    onChange={handleDateChange}
                    disabledDate={disabledDate}
                    disabled={!fields.branchId}
                  />
                  {errors.date && <S.ErrorText>{errors.date}</S.ErrorText>}
                </S.FieldGroup>
                <S.FieldGroup>
                  <S.FieldLabel htmlFor="time">Preferred Time</S.FieldLabel>
                  <S.StyledTimePicker
                    id="time"
                    style={{ width: "100%" }}
                    format="h:mm A"
                    use12Hours
                    placeholder="Select time"
                    value={fields.time ? dayjs(fields.time, "HH:mm:ss") : null}
                    onChange={handleTimeChange}
                    disabledTime={disabledTime}
                    hideDisabledOptions
                    disabled={!fields.branchId || !fields.date}
                    popupStyle={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                    }}
                    popupClassName="time-picker-no-scrollbar"
                  />
                  {errors.time && <S.ErrorText>{errors.time}</S.ErrorText>}
                </S.FieldGroup>
              </S.FieldRow>

              <SelectField
                id="serviceBranchId"
                name="serviceBranchId"
                label="Service"
                options={services.map((s) => ({ value: s.service_branch_id, label: s.name }))}
                value={fields.serviceBranchId}
                onChange={handleChange}
                placeholder={fields.branchId ? "Select a service" : "Select a branch first"}
                error={errors.serviceBranchId}
                loading={servicesLoading}
                disabled={!fields.branchId || services.length === 0}
                required
              />

              <TextField
                id="notes"
                name="notes"
                label="Notes / Remarks"
                placeholder="Any special requests or additional information"
                value={fields.notes}
                onChange={handleChange}
                error={errors.notes}
                multiline
                rows={3}
              />
            </S.FieldGroup>
          </S.FormSection>

          {/* Form-level error */}
          {errors.form && <S.FormError role="alert">{errors.form}</S.FormError>}

          {/* Submit */}
          <S.SubmitButton
            type="submit"
            disabled={loading}
            aria-label="Submit appointment request"
          >
            {loading ? "Submitting…" : "Book Appointment"}
            {!loading && <AiOutlineSend aria-hidden="true" />}
          </S.SubmitButton>
        </div>
      </form>
    </S.FormCard>
  );
};

export default memo(BookAppointmentForm);