// src/pages/admin/Users/sections/Table/Table.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

const champagne = adminTheme.colors.champagne;

export const TableCard = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 20px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const ScrollWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${champagne};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
  font-size: 14px;
`;

export const THead = styled.thead`
  background: ${champagne};
`;

export const TBody = styled.tbody``;

export const TR = styled.tr`
  border-bottom: 1px solid ${champagne};
  background: ${({ $selected }) =>
    $selected ? "rgba(136,98,23,0.05)" : "transparent"};
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ $selected }) =>
      $selected ? "rgba(136,98,23,0.08)" : "rgba(0,0,0,0.02)"};
  }
`;

export const TH = styled.th`
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  white-space: nowrap;
  border-bottom: 1px solid ${champagne};
  width: ${({ $checkbox }) => ($checkbox ? "48px" : "auto")};
  &:first-child {
    padding-left: 20px;
  }
  &:last-child {
    padding-right: 20px;
  }
`;

export const TD = styled.td`
  padding: 12px 14px;
  font-size: 14px;
  color: ${adminTheme.colors.black};
  vertical-align: middle;
  text-align: ${({ $center }) => ($center ? "center" : "left")};
  border-bottom: 1px solid ${champagne};
  &:first-child {
    padding-left: 20px;
  }
  &:last-child {
    padding-right: 20px;
  }
`;

export const NameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

export const RoleBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 11px;
  font-weight: 500;
  border: 1px solid ${({ $color }) => $color}40;
  width: fit-content;
`;

export const LoadingText = styled.div`
  text-align: center;
  padding: 40px 0;
  color: ${adminTheme.colors.gray};
  font-size: 14px;
`;

export const EmptyText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 0;
  color: ${adminTheme.colors.gray};
  svg {
    font-size: 48px !important;
    color: ${adminTheme.colors.champagne};
  }
  p {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  span {
    font-size: 13px;
    color: #aaa;
  }
`;

export const PaginationWrapper = styled.div`
  padding: 8px 0 4px;
`;
