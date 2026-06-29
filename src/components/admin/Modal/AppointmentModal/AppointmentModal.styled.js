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

export const FieldLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: ${adminTheme.colors.black};
  margin-bottom: 4px;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
`;

export const CancelBtn = styled.button`
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
`;

export const SubmitBtn = styled.button`
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
