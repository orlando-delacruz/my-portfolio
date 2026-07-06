// src/pages/admin/Settings/sections/OperatingHours/TimeTable.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 0 5px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
  min-width: 500px;
`;

export const Thead = styled.thead`
  background: ${adminTheme.colors.champagne};
`;

export const Tbody = styled.tbody`
  // any styles
`;

export const Tr = styled.tr`
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);

  &:last-child {
    border-bottom: none;
  }
`;

export const Th = styled.th`
  padding: 8px 6px;
  text-align: left;
  font-weight: 600;
  color: ${adminTheme.colors.black};
`;

export const Td = styled.td`
  padding: 6px 4px;
  vertical-align: middle;
  color: ${adminTheme.colors.black};

  .ant-select {
    width: 90px !important;
  }

  .ant-select-selector {
    border-radius: 4px !important;
    border-color: rgba(0,0,0,0.15) !important;
    height: 28px !important;
    padding: 0 6px !important;
    font-size: 10px !important;
  }

  .ant-select-selection-item {
    font-size: 10px !important;
    line-height: 26px !important;
  }

  .ant-switch {
    min-width: 28px;
    height: 16px;
    line-height: 16px;

    .ant-switch-handle {
      width: 12px;
      height: 12px;
      top: 2px;
      left: 2px;

      &::before {
        border-radius: 50%;
      }
    }

    &.ant-switch-checked {
      background-color: ${adminTheme.colors.primary};
    }
  }
`;