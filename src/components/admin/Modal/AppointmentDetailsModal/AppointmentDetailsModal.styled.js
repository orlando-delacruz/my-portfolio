// src/components/admin/Modal/AppointmentDetailsModal/AppointmentDetailsModal.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
`;

export const Content = styled.div`
  padding: 8px 0;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 16px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid ${adminTheme.colors.champagne};
  grid-column: 1 / -1;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${adminTheme.colors.gray};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  word-break: break-word;
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
  white-space: nowrap;
  width: fit-content;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 0;
`;