// src/components/admin/Modal/UserModal/UserModal.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid ${adminTheme.colors.champagne};
  margin-top: 8px;
`;

export const CancelBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: ${adminTheme.colors.ivory};
  color: ${adminTheme.colors.black};
  font-size: 14px;
  font-weight: 500;
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

export const AvatarUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AvatarPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${adminTheme.colors.champagne};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${adminTheme.colors.ivory};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: ${adminTheme.colors.gray};
    font-size: 12px;
  }
`;
