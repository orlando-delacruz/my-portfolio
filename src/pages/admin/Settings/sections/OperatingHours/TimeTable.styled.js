// src/pages/admin/Settings/sections/OperatingHours/TimeTable.styled.js
import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d8c6a5;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  font-family: "Inter", sans-serif;

  @media (max-width: 768px) {
    min-width: 500px;
  }
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:last-child {
    border-bottom: none;
  }
`;

export const Th = styled.th`
  padding: 8px 6px;
  text-align: left;
  font-weight: 500;
  color: #222222;
  font-size: 10px;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 6px 6px;
  text-align: left;
  vertical-align: middle;
  color: #222222;
`;

export const TimeSelect = styled.select`
  padding: 4px 6px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.20);
  background: #ffffff;
  font-size: 10px;
  font-family: "Inter", sans-serif;
  color: #222222;
  outline: none;
  width: 80px;

  &:focus {
    border-color: #886217;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 70px;
  }
`;