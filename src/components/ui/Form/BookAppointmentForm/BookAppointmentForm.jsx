import { memo } from "react";
import { AiOutlineSend } from "react-icons/ai";
import * as S from "./BookAppointmentForm.styled";
import { TextField, SelectField, BranchToggleField } from "../../Fields";
import SuccessView from "../../SuccessView";
import { useBookAppointmentForm } from "./useBookAppointmentForm";
import Logo from "../../../../assets/images/logo.png";

const BRANCH_OPTIONS = [
  { value: "rosario", label: "Rosario Branch" },
  { value: "sanjuan", label: "San Juan Branch" },
];

const REASON_OPTIONS = [
  { value: "general", label: "General Check-up" },
  { value: "cleaning", label: "Dental Cleaning" },
  { value: "extraction", label: "Tooth Extraction" },
  { value: "filling", label: "Tooth Filling" },
  { value: "root-canal", label: "Root Canal Treatment" },
  { value: "whitening", label: "Teeth Whitening" },
  { value: "orthodontics", label: "Orthodontics / Braces" },
  { value: "pediatric", label: "Pediatric Dentistry" },
  { value: "other", label: "Other" },
];

const BookAppointmentForm = () => {
  const {
    fields,
    errors,
    loading,
    submitted,
    handleChange,
    handleBranchChange,
    handleSubmit,
    handleReset,
  } = useBookAppointmentForm();

  if (submitted)
    return (
      <S.FormCard>
        <SuccessView onReset={handleReset} />
      </S.FormCard>
    );

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

            <S.FieldGroup>
              <TextField
                id="mobile"
                name="mobile"
                label="Mobile Number"
                type="tel"
                placeholder="09123456789"
                value={fields.mobile}
                onChange={handleChange}
                error={errors.mobile}
                required
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                value={fields.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <TextField
                id="facebookName"
                name="facebookName"
                label="Facebook Name"
                placeholder="Juan Dela Cruz"
                value={fields.facebookName}
                onChange={handleChange}
                error={errors.facebookName}
              />
            </S.FieldGroup>
          </S.FormSection>

          {/* ── Appointment information ── */}
          <S.FormSection aria-labelledby="appointment-section-title">
            <S.FormSectionTitle id="appointment-section-title">
              Appointment Information
            </S.FormSectionTitle>

            <S.FieldGroup>
              <BranchToggleField
                id="branch"
                label="Choose Branch"
                options={BRANCH_OPTIONS}
                value={fields.branch}
                onChange={handleBranchChange}
                error={errors.branch}
                required
              />

              <S.FieldRow>
                <TextField
                  id="date"
                  name="date"
                  label="Preferred Date"
                  type="date"
                  value={fields.date}
                  onChange={handleChange}
                  error={errors.date}
                  required
                />
                <TextField
                  id="time"
                  name="time"
                  label="Preferred Time"
                  type="time"
                  value={fields.time}
                  onChange={handleChange}
                  error={errors.time}
                  required
                />
              </S.FieldRow>

              <SelectField
                id="reason"
                name="reason"
                label="Reason for Visit"
                options={REASON_OPTIONS}
                value={fields.reason}
                onChange={handleChange}
                placeholder="Select"
                error={errors.reason}
                required
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
            {loading ? "Submitting…" : "Submit Appointment"}
            {!loading && <AiOutlineSend aria-hidden="true" />}
          </S.SubmitButton>
        </div>
      </form>
    </S.FormCard>
  );
};

export default memo(BookAppointmentForm);