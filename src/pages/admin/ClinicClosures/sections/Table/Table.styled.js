// src/pages/admin/ClinicClosures/sections/Table/Table.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

const champagne = adminTheme.colors.champagne;

export const TableCard = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

export const ScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  table-layout: auto;
`;

export const THead = styled.thead`
  background: ${champagne};
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  border-bottom: 1px solid ${champagne};
  background: ${({ $selected }) =>
    $selected ? "rgba(136, 98, 23, 0.06)" : "transparent"};
  transition: background 0.15s;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

export const TH = styled.th`
  padding: 10px 14px;
  font-size: 14px; /* increased to 14px */
  font-weight: 600;
  color: ${adminTheme.colors.black};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
  border-bottom: 1px solid ${champagne};
  width: ${({ $checkbox }) => ($checkbox ? "48px" : "auto")};
`;

export const TD = styled.td`
  padding: 10px 14px;
  font-size: 14px; /* increased to 14px */
  color: ${adminTheme.colors.black};
  vertical-align: middle;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
  border-bottom: 1px solid ${champagne};
`;

export const DateCell = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.5;
`;

export const DayOfWeek = styled.span`
  font-size: 12px; /* slightly smaller for day of week */
  color: ${adminTheme.colors.gray};
  font-weight: 400;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 5px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 12px; /* slightly smaller for badge */
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid ${({ $color }) => $color};
`;

export const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px; /* slightly smaller for badge */
  color: ${adminTheme.colors.black};
  line-height: 15px;

  svg {
    font-size: 16px;
    color: ${adminTheme.colors.primary};
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px; /* slightly smaller for button text */
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  transition:
    opacity 0.2s,
    background 0.2s;

  ${({ $variant }) => {
    switch ($variant) {
      case "danger":
        return `
          color: #F81313;
          background: rgba(248,19,19,0.10);
          &:hover { background: rgba(248,19,19,0.20); }
        `;
      default:
        return `
          color: ${adminTheme.colors.primary};
          background: rgba(136,98,23,0.08);
          &:hover { background: rgba(136,98,23,0.16); }
        `;
    }
  }}

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const LoadingText = styled.div`
  text-align: center;
  padding: 32px 0;
  color: ${adminTheme.colors.gray};
  font-size: 14px;
`;

export const EmptyText = styled.div`
  text-align: center;
  padding: 32px 0;
  color: ${adminTheme.colors.gray};
  font-size: 14px;
`;
