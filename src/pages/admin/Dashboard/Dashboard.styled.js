// src/pages/admin/Dashboard/Dashboard.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";

const champagne = adminTheme.colors.champagne;

// Softer, more layered shadow treatment for a modern SaaS feel.
const CARD_SHADOW = "0 1px 2px rgba(17, 17, 17, 0.04), 0 2px 8px rgba(17, 17, 17, 0.05)";
const CARD_SHADOW_HOVER = "0 6px 20px rgba(17, 17, 17, 0.10)";

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
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  letter-spacing: -0.02em;
`;

export const WelcomeSubtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.6;
`;

export const DateBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${champagne};
  border-radius: 12px;
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

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: ${adminTheme.colors.white};
  border: 1px solid ${champagne};
  border-radius: 16px;
  box-shadow: ${CARD_SHADOW};
  min-width: 0;
  overflow: hidden;
  height: 100px;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: ${CARD_SHADOW_HOVER};
    transform: translateY(-1px);
    cursor: pointer;
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
    gap: 12px;
    border-radius: 14px;
    flex-direction: column;
    align-items: flex-start;
    height: 130px;
  }

  @media (max-width: 360px) {
    padding: 12px 8px;
    gap: 8px;
  }
`;

export const StatIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    font-size: 22px;
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
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

export const StatLabel = styled.span`
  font-size: 13px;
  color: ${adminTheme.colors.black};
  opacity: 0.7;
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
  font-size: 24px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 24px;
  }

  @media (max-width: 360px) {
    font-size: 20px;
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

// ── Main content grid (Next Appointment | Today's Schedule) ─────────────────
export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-areas: "nextappt schedule";
  gap: 24px;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "nextappt"
      "schedule";
    gap: 16px;
    align-items: start;
  }
`;

// ── Next Appointment Card ────────────────────────────────────────────────────
export const NextApptCard = styled.div`
  grid-area: nextappt;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    145deg,
    ${adminTheme.colors.primary} 0%,
    ${adminTheme.colors.primary} 55%,
    rgba(0, 0, 0, 0.12) 160%
  );
  border-radius: 20px;
  box-shadow: ${CARD_SHADOW};
  padding: 22px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;

  &::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -80px;
    left: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    padding: 20px;
  }
`;

export const NextApptLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  z-index: 1;

  svg {
    font-size: 15px;
  }
`;

export const NextApptTime = styled.div`
  font-size: 34px;
  font-weight: 700;
  color: ${adminTheme.colors.white};
  line-height: 1.1;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const NextApptBody = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
`;

export const AvatarCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: ${adminTheme.colors.primaryDark};
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.white};
  flex-shrink: 0;
  backdrop-filter: blur(2px);

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const NextApptInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
`;

export const NextApptName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${adminTheme.colors.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NextApptMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

export const NextApptDate = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
`;

export const NextApptService = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
  margin: 0;
  position: relative;
  z-index: 1;
`;

export const ViewApptBtn = styled.button`
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  font-family: inherit;
  transition: opacity 0.2s, transform 0.2s;
  align-self: flex-start;
  position: relative;
  z-index: 1;
  margin-top: auto;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
`;

// ── Today's Schedule Card ────────────────────────────────────────────────────
export const ScheduleCard = styled.div`
  grid-area: schedule;
  border: 1px solid ${champagne};
  border-radius: 20px;
  box-shadow: ${CARD_SHADOW};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${adminTheme.colors.white};
  min-width: 0;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${CARD_SHADOW_HOVER};
  }
`;

export const ScheduleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 4px;
  flex-shrink: 0;
`;

export const ScheduleTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  letter-spacing: -0.01em;

  svg {
    font-size: 19px;
    color: ${adminTheme.colors.primary};
  }
`;

export const ViewCalendarLink = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: ${adminTheme.colors.primary};
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    opacity: 0.7;
  }
`;

export const ScheduleSubtitle = styled.p`
  font-size: 13px;
  color: ${adminTheme.colors.gray};
  margin: 0 0 12px 0;
  padding: 0 22px;
  opacity: 0.7;
`;

export const ScheduleScrollWrapper = styled.div`
  overflow-y: auto;
  max-height: 420px;
  padding: 0 2px 12px;

  scrollbar-width: thin;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${adminTheme.colors.champagne};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    max-height: 360px;
  }

  @media (max-width: 480px) {
    max-height: 320px;
  }
`;

export const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
`;

export const ScheduleThead = styled.thead`
  background: rgba(216, 198, 165, 0.5);
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const ScheduleTh = styled.th`
  padding: 12px 22px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.65;
  border-bottom: 1px solid ${champagne};

  @media (max-width: 600px) {
    padding: 8px 14px;
    font-size: 11px;
  }
`;

export const ScheduleTd = styled.td`
  padding: 10px;
  font-size: 14px;
  border-bottom: 1px solid #f4f0eb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  color: ${adminTheme.colors.black};

  tr:last-child & {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    padding: 8px 14px;
    font-size: 12px;
    max-width: 100px;
  }

  @media (max-width: 480px) {
    max-width: 70px;
  }
`;

// ── Three-column grid (Upcoming, Recent Activity, Walk-ins) ──────────────────
export const ThreeColGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const Panel = styled.div`
  padding: 18px;
  background: ${adminTheme.colors.white};
  border: 1px solid ${champagne};
  border-radius: 16px;
  box-shadow: ${CARD_SHADOW};
  display: flex;
  flex-direction: column;
  height: 380px;
  overflow: hidden;
  gap: 10px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${CARD_SHADOW_HOVER};
  }
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
  font-weight: 600;
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

// ── Shared row styles ─────────────────────────────────────────────────────────
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

// ── Activity row ─────────────────────────────────────────────────────────────
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
  align-self: flex-start;
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;