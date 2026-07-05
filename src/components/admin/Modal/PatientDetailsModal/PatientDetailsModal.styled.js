// src/components/admin/Modal/PatientDetailsModal/PatientDetailsModal.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const PatientName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
`;

export const PatientSubtitle = styled.span`
  font-size: 13px;
  color: ${adminTheme.colors.gray};
  opacity: 0.8;
`;

// ── Action Row ──
export const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid ${adminTheme.colors.champagne};

  @media (max-width: 480px) {
    gap: 8px;
    button {
      width: 100%;
    }
  }
`;

// ── Avatar & Badges ──
export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const OrthoTag = styled.span`
  display: inline-block;
  padding: 2px 12px;
  border-radius: 4px;
  background: ${({ $isOrtho }) =>
    $isOrtho ? "rgba(136,98,23,0.15)" : "rgba(0,0,0,0.05)"};
  color: ${({ $isOrtho }) => ($isOrtho ? adminTheme.colors.primary : "#888")};
  font-size: 12px;
  font-weight: 500;
  border: 1px solid
    ${({ $isOrtho }) => ($isOrtho ? adminTheme.colors.primary + "40" : "#ddd")};
  margin-right: 6px;
`;

export const BranchTag = styled.span`
  display: inline-block;
  padding: 2px 12px;
  border-radius: 4px;
  background: rgba(25, 118, 210, 0.15);
  color: #1976d2;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #1976d240;
`;

// ── Info Grid ──
export const InfoGrid = styled.div`
  margin-top: 4px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${adminTheme.colors.gray};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  display: flex;
  align-items: center;
  gap: 4px;

  .anticon {
    font-size: 12px;
  }
`;

export const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  word-break: break-word;
  padding: 2px 0;
`;
