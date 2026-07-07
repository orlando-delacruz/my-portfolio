// src/components/ui/Form/BookAppointmentForm/BookAppointmentForm.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const FullWidth = styled.div`
  width: 100%;
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

export const BookingFormWrapper = styled.div``;

export const FormSection = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SectionTitle = styled.legend`
  font-size: ${theme.typography.heading.h3} !important;
  font-weight: ${theme.typography.weight.medium} !important;
  color: ${theme.colors.black} !important;
  line-height: 1.5 !important;
  margin-bottom: 14px !important;
  padding: 0 !important;
  float: left !important;
  width: 100% !important;
  padding-bottom: 1rem !important;
  border-bottom: 1px solid ${theme.colors.secondary};
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  svg {
    font-size: 18px;
    color: ${theme.colors.primary};
  }
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

export const FormError = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  text-align: center;
  margin: 0;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

export const SummaryCard = styled.div`
  margin: 16px 0;
  background: #fafafa;
  border-radius: 12px;
  padding: 4px;
  .ant-card {
    background: transparent;
    border: none;
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
  padding: 8px 0;

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const SummaryItem = styled.div`
  font-size: 14px;
  color: ${theme.colors.black};
  strong {
    color: ${theme.colors.primary};
  }
`;