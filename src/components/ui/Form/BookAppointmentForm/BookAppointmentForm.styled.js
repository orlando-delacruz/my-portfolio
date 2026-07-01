// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.styled.js
import styled, { keyframes } from "styled-components";
import { DatePicker, TimePicker } from "antd";
import theme from "../../../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Form card ───────────────────────────────────────── */
export const FormCard = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
  background: ${theme.colors.white};
  border-radius: 20px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 50px;
  animation: ${fadeIn} 0.5s ease both;

  @media ${theme.media.mobile} {
    padding: 24px 20px;
    gap: 36px;
  }
`;

/* ─── Clinic brand block at the top ──────────────────── */
export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const BrandLogo = styled.img`
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
`;

export const BrandName = styled.h1`
  font-size: clamp(2rem, 5vw, 2.5rem);
  font-weight: 400;
  color: ${theme.colors.primary};
  text-align: center;
  margin: 0;
  line-height: 1.4;
`;

export const BrandTagline = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.primaryDark};
  text-align: center;
  margin: 0;
`;

/* ─── Section divider within form ────────────────────── */
export const FormSection = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormSectionTitle = styled.legend`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
  margin-bottom: 14px;
  padding: 0;
  float: left;
  width: 100%;
`;

/* ─── Two-column row for paired fields ───────────────── */
export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 10px 0;

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

/* ─── Field group (full width, single col) ───────────── */
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

/* ─── Form-level error ────────────────────────────────── */
export const FormError = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  text-align: center;
  margin: 0;
`;

/* ─── Submit button ───────────────────────────────────── */
export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 50px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 20px;
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  line-height: 1.5;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  transition:
    background 0.2s ease,
    transform 0.15s ease;

  svg {
    font-size: 22px;
    flex-shrink: 0;
  }

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
  }

  @media ${theme.media.mobile} {
    width: 100%;
    justify-content: center;
  }
`;

/* ─── Text area (for multiline) ───────────────────────── */
export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

/* ─── Shared label and error text ────────────────────── */
export const FieldLabel = styled.label`
  display: block;
  font-size: ${theme.typography.size.lg};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  margin-bottom: 4px;
`;

export const ErrorText = styled.span`
  color: ${theme.colors.danger};
  font-size: 12px;
  margin-top: 4px;
`;

export const StyledDatePicker = styled(DatePicker)`
  && {
    width: 100%;
    height: 44px; /* fixed height to match Select */
    border-radius: 50px !important;
    border: 1.5px solid ${theme.colors.primary} !important;
    background: ${theme.colors.white} !important;
    font-size: ${theme.typography.size.body} !important;
    font-family: inherit !important;
    color: ${theme.colors.black} !important;
    padding: 0 !important; /* remove extra padding from container */
    box-sizing: border-box !important;

    .ant-picker-input {
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 20px !important;

      input {
        font-size: ${theme.typography.size.body} !important;
        color: ${theme.colors.black} !important;
        height: 100% !important;
        padding: 0 !important;
        &::placeholder {
          color: #555555 !important;
        }
      }

      .ant-picker-suffix {
        color: ${theme.colors.primary} !important;
      }
    }

    &:hover,
    &.ant-picker-focused {
      border-color: ${theme.colors.primaryDark} !important;
      box-shadow: 0 0 0 3px ${theme.colors.primary}22 !important;
    }

    &.ant-picker-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

/* ─── Custom TimePicker to match form styling ────────── */
export const StyledTimePicker = styled(TimePicker)`
  && {
    width: 100%;
    height: 44px; /* fixed height to match Select */
    border-radius: 50px !important;
    border: 1.5px solid ${theme.colors.primary} !important;
    background: ${theme.colors.white} !important;
    font-size: ${theme.typography.size.body} !important;
    font-family: inherit !important;
    color: ${theme.colors.black} !important;
    padding: 0 !important;
    box-sizing: border-box !important;

    .ant-picker-input {
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 20px !important;

      input {
        font-size: ${theme.typography.size.body} !important;
        color: ${theme.colors.black} !important;
        height: 100% !important;
        padding: 0 !important;
        &::placeholder {
          color: #555555 !important;
        }
      }

      .ant-picker-suffix {
        color: ${theme.colors.primary} !important;
      }
    }

    &:hover,
    &.ant-picker-focused {
      border-color: ${theme.colors.primaryDark} !important;
      box-shadow: 0 0 0 3px ${theme.colors.primary}22 !important;
    }

    &.ant-picker-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
