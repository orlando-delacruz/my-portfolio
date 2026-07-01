import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

const champagne = adminTheme.colors.champagne;

export const TableCard = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-top: 16px;
`;

export const ScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* Hide scrollbar on all browsers */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
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

  &:last-child {
    border-bottom: none;
  }
`;

export const TH = styled.th`
  padding: 14px 12px;
  font-size: 13px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
  border-bottom: 1px solid ${champagne};
  width: ${({ $checkbox }) => ($checkbox ? "48px" : "auto")};
`;

export const TD = styled.td`
  padding: 14px 12px;
  font-size: 14px;
  color: ${adminTheme.colors.black};
  vertical-align: middle;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
  border-bottom: 1px solid ${champagne};
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
`;

export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

export const BranchBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $border }) => $border};
  font-size: 12px;
  font-weight: 500;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  white-space: nowrap;
  background: ${({ $variant }) =>
    $variant === "primary" ? adminTheme.colors.primary : "transparent"};
  color: ${({ $variant }) =>
    $variant === "primary" ? "#fff" : adminTheme.colors.black};
  border: ${({ $variant }) =>
    $variant === "secondary" ? `1px solid ${champagne}` : "none"};
  transition:
    opacity 0.2s,
    background 0.2s;

  &:hover {
    opacity: 0.85;
    background: ${({ $variant }) =>
      $variant === "primary"
        ? adminTheme.colors.primaryDark
        : "rgba(0,0,0,0.04)"};
  }

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
