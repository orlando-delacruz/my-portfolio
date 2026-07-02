// src/pages/admin/Dashboard/Dashboard.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";

const champagne = adminTheme.colors.champagne;

// ── Page wrapper ──────────────────────────────────────────────────────────────
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  padding-bottom: 32px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`;

// ── Welcome bar ───────────────────────────────────────────────────────────────
export const WelcomeBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const WelcomeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const WelcomeHeading = styled.h1`
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const WelcomeSubtitle = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.75;
`;

export const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${champagne};
  border-radius: 10px;
  flex-shrink: 0;

  svg {
    font-size: 28px;
    color: ${adminTheme.colors.black};
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    gap: 6px;
    svg {
      font-size: 20px;
    }
  }
`;

export const DateInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DateText = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${adminTheme.colors.black};
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const DayText = styled.span`
  font-size: 12px;
  color: ${adminTheme.colors.black};
  opacity: 0.6;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

// ── Stats grid ─────────────────────────────────────────────────────────────────
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 16px;
  background: ${adminTheme.colors.white};
  border: 1px solid ${champagne};
  border-radius: 16px;
  box-shadow: 1px 1px 4px ${champagne};
  min-width: 0;
  overflow: hidden;
  height: 100px;

  @media (max-width: 480px) {
    padding: 14px 12px;
    gap: 12px;
    border-radius: 12px;
    height: 85px;
    flex-direction: column;
    height: 140px;
    align-items: start;
  }
`;

export const StatIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 24px;
    color: ${({ $color }) => $color};
  }

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
    svg {
      font-size: 20px;
    }
  }

  @media (max-width: 360px) {
    width: 36px;
    height: 36px;
    svg {
      font-size: 16px;
    }
  }
`;

export const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  color: ${adminTheme.colors.black};
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 11px;
  }

  @media (max-width: 360px) {
    font-size: 10px;
  }
`;

export const StatValue = styled.span`
  font-size: 22px;
  font-weight: 500;
  color: ${adminTheme.colors.black};
  line-height: 1.3;

  @media (max-width: 480px) {
    font-size: 18px;
  }

  @media (max-width: 360px) {
    font-size: 16px;
  }
`;

export const StatNote = styled.span`
  font-size: 11px;
  color: ${({ $color }) => $color};
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 10px;
  }

  @media (max-width: 360px) {
    font-size: 9px;
  }
`;

// ── Two-column grid: Next Appt + Schedule ────────────────────────────────────
export const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

// ── Next Appointment card ─────────────────────────────────────────────────────
export const NextApptCard = styled.div`
  background: ${adminTheme.colors.primary};
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const NextApptLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${adminTheme.colors.white};
  font-size: 12px;

  svg {
    font-size: 15px;
  }
`;

export const NextApptBody = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const AvatarCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? "#B388FF"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: ${adminTheme.colors.white};
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
`;

export const NextApptInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

export const NextApptName = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: ${adminTheme.colors.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const NextApptMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TimeBadge = styled.span`
  padding: 3px 10px;
  background: ${champagne};
  border-radius: 20px;
  font-size: 11px;
  color: ${adminTheme.colors.black};
`;

export const NextApptDate = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
`;

export const NextApptService = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  margin: 0;
`;

export const ViewApptBtn = styled.button`
  padding: 8px 14px;
  background: ${champagne};
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${adminTheme.colors.black};
  font-family: inherit;
  transition: opacity 0.2s;
  margin-top: 10px;

  &:hover {
    opacity: 0.82;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
`;

// ── Schedule card ─────────────────────────────────────────────────────────────
export const ScheduleCard = styled.div`
  border: 1px solid ${champagne};
  border-radius: 20px;
  overflow: hidden;
`;

export const ScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
`;

export const ScheduleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${adminTheme.colors.black};

  svg {
    font-size: 17px;
  }
`;

export const ViewCalendarLink = styled.button`
  font-size: 12px;
  color: ${adminTheme.colors.black};
  text-decoration: underline;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

// ── Responsive scroll wrapper for table ──────────────────────────────────────
export const ScheduleScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 2px;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${adminTheme.colors.champagne};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;

  @media (max-width: 768px) {
    min-width: 640px;
  }
`;

export const ScheduleThead = styled.thead`
  background: rgba(216, 198, 165, 0.7);
`;

export const ScheduleTh = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  border-bottom: 1px solid ${champagne};

  @media (max-width: 600px) {
    padding: 8px 10px;
    font-size: 12px;
  }
`;

export const ScheduleTd = styled.td`
  padding: 10px 14px;
  font-size: 14px;
  border-bottom: 1px solid ${champagne};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  color: ${adminTheme.colors.black};

  tr:last-child & {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    padding: 8px 10px;
    font-size: 12px;
    max-width: 100px;
  }

  @media (max-width: 480px) {
    max-width: 70px;
  }
`;

// ── Three-column grid ─────────────────────────────────────────────────────────
export const ThreeColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

// ── Shared panel ──────────────────────────────────────────────────────────────
export const Panel = styled.div`
  padding: 18px;
  background: ${adminTheme.colors.white};
  border-radius: 12px;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  height: 400px;
  overflow: hidden;
  gap: 10px;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const PanelTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: ${adminTheme.colors.black};

  svg {
    font-size: 18px;
    color: ${adminTheme.colors.primary};
  }
`;

export const ViewAllLink = styled.button`
  font-size: 13px;
  color: #1976d2;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

export const PanelContent = styled.div`
  flex: 1;
  overflow-y: auto;
  margin: 0 -6px;
  padding: 4px 6px;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${adminTheme.colors.champagne};
    border-radius: 4px;
  }
`;

// ── Upcoming appointment item ─────────────────────────────────────────────────
export const ApptRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f4f0eb;
  gap: 8px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ApptLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const ApptAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: ${adminTheme.colors.white};
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

export const ApptDetails = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ApptName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;

  @media (max-width: 480px) {
    font-size: 13px;
    max-width: 150px;
  }
`;

export const ApptService = styled.span`
  font-size: 11px;
  color: ${adminTheme.colors.gray};
`;

export const ApptRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
`;

export const ApptDate = styled.span`
  font-size: 11px;
  color: ${adminTheme.colors.grayLight};
`;

export const ApptTime = styled.span`
  font-size: 10px;
  color: ${adminTheme.colors.gray};
`;

// ── Activity item ─────────────────────────────────────────────────────────────
export const ActivityRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f4f0eb;
  gap: 8px;

  &:last-child {
    border-bottom: none;
  }
`;

export const ActivityLeft = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const ActivityIconWrap = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ $color }) => $color}18;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 16px;
    color: ${({ $color }) => $color};
  }
`;

export const ActivityMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const ActivityTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  line-height: 1.4;
`;

export const ActivityDetail = styled.span`
  font-size: 10px;
  color: ${adminTheme.colors.grayLight};
  line-height: 1.5;
  word-break: break-word;
`;

export const ActivityTime = styled.span`
  font-size: 10px;
  color: ${adminTheme.colors.grayLight};
  flex-shrink: 0;
  padding-top: 2px;
  white-space: nowrap;
  cursor: default;
`;

// ── Status Badge ──────────────────────────────────────────────────────────────
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
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

// ── Quick actions ─────────────────────────────────────────────────────────────
export const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

export const QuickBtn = styled.button`
  padding: 16px 8px;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $color }) => $color};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition:
    opacity 0.2s,
    transform 0.15s;
  font-family: inherit;
  min-width: 0;

  svg {
    font-size: 20px;
    color: ${({ $color }) => $color};
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: ${({ $color }) => $color};
    text-align: center;
    line-height: 1.3;
    word-break: break-word;
  }

  &:hover {
    opacity: 0.82;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ $color }) => $color};
    outline-offset: 2px;
  }
`;
