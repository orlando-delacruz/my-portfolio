// src/components/admin/Modal/AppointmentModal/AppointmentModal.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

export const SectionTitle = styled.h3`
  grid-column: 1 / -1;
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 16px 0 8px 0;
  padding-bottom: 6px;
  border-bottom: 1px solid ${adminTheme.colors.champagne};
  display: flex;
  align-items: center;
  gap: 8px;
  svg {
    font-size: 18px;
    color: ${adminTheme.colors.primary};
  }
`;

export const FieldRow = styled.div`
  display: contents;
  @media (max-width: 576px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-column: 1 / -1;
  }
`;

export const FooterRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid ${adminTheme.colors.champagne};
  margin-top: 8px;
`;

export const CancelBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: ${adminTheme.colors.ivory};
  color: ${adminTheme.colors.black};
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${adminTheme.colors.champagne};
  }
  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SubmitBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 24px;
  border-radius: 8px;
  border: none;
  background: ${adminTheme.colors.primary};
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${adminTheme.colors.primaryDark};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const WarningCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: #fefaf0;
  border: 1px solid #fde8c8;
  border-radius: 10px;
  margin: 8px 0;
  width: 100%;
`;

export const CardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #e67e22;
  margin-top: 2px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const CardTitle = styled.strong`
  font-size: 14px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.4;
`;

export const CardDescription = styled.span`
  font-size: 13px;
  color: ${adminTheme.colors.gray};
  line-height: 1.5;
  margin: 0;
`;