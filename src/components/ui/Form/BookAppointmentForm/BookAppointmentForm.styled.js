// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

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

export const FormSection = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormSectionTitle = styled.legend`
  font-size: ${theme.typography.heading.h3} !important;
  font-weight: ${theme.typography.weight.medium} !important;
  color: ${theme.colors.black} !important;
  line-height: 1.5 !important;
  margin-bottom: 14px !important;
  padding: 0 !important;
  float: left !important;
  width: 100% !important;
  padding-bottom: 1rem !important;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 10px 0;

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

export const FormError = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  text-align: center;
  margin: 0;
`;

export const InfoText = styled.span`
  font-size: 13px;
  color: ${theme.colors.primary};
  margin-top: 4px;
  display: block;
`;

export const WarningText = styled.span`
  color: #e67e22;
  font-size: 13px;
  margin-top: 4px;
  display: block;
  background: #fef9e7;
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #e67e22;
  line-height: 1.5;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

export const BookingFormWrapper = styled.div`
  /* Placeholder color - darker for readability */
  .ant-input::placeholder,
  .ant-select-selection-placeholder,
  .ant-picker-input input::placeholder,
  .ant-input-affix-wrapper .ant-input::placeholder,
  .ant-input-textarea textarea::placeholder {
    color: #8c8c8c !important;
  }

  .ant-select-selection-placeholder {
    color: #8c8c8c !important;
    font-size: inherit !important;
  }

  /* Border color - slightly darker for visibility */
  .ant-input,
  .ant-select-selector,
  .ant-picker,
  .ant-input-affix-wrapper,
  .ant-input-textarea textarea {
    border-color: #b3b3b3 !important;
  }

  /* Hover state */
  .ant-input:hover,
  .ant-select-selector:hover,
  .ant-picker:hover {
    border-color: #40a9ff !important;
  }

  /* Focus state - keep default Ant Design focus */
  .ant-input:focus,
  .ant-select-focused .ant-select-selector,
  .ant-picker-focused {
    border-color: #40a9ff !important;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
  }

  /* Disabled state - keep default */
  .ant-input-disabled,
  .ant-select-disabled .ant-select-selector,
  .ant-picker-disabled {
    background-color: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
  }
`;
