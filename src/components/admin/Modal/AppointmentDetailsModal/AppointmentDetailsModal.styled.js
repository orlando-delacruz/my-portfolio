// src/components/admin/Modal/AppointmentDetailsModal/AppointmentDetailsModal.styled.js
import styled from 'styled-components';
import adminTheme from '../../../../styles/adminTheme';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 4px;
`;

export const PatientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

export const PatientName = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.3;
`;

export const PatientMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: ${adminTheme.colors.gray};
`;

// ── Action Container ──
export const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 0 0 12px 0;
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: stretch;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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
`;

export const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  word-break: break-word;
`;

export const NotesSection = styled.div`
  margin-bottom: 12px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const NoteLabel = styled.div`
  font-weight: 500;
  color: ${adminTheme.colors.gray};
  font-size: 13px;
  margin-bottom: 4px;
`;

export const NoteText = styled.div`
  font-size: 14px;
  color: ${adminTheme.colors.black};
  white-space: pre-wrap;
  word-break: break-word;
  background: #fafafa;
  padding: 8px 12px;
  border-radius: 6px;
  min-height: 40px;
`;