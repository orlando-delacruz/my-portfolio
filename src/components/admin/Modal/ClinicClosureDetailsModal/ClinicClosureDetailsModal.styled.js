// src/components/admin/Modal/ClinicClosureDetailsModal/ClinicClosureDetailsModal.styled.js
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

export const ClosureTitle = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
`;

export const ClosureSubtitle = styled.span`
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

// ── Badges ──
export const BadgeSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 500;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(136, 98, 23, 0.15);
  color: ${adminTheme.colors.primary};
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${adminTheme.colors.primary}40;
`;

export const BranchBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
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
