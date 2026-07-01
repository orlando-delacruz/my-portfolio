// src\components\admin\Filter\Filters\Filters.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const BranchSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: ${adminTheme.colors.white};
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  .ant-select {
    font-family: Inter, sans-serif;
    font-size: 16px;
    font-weight: 500;
  }

  .ant-select-selector {
    padding-left: 4px !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

export const FilterToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: ${adminTheme.colors.white};
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: ${adminTheme.colors.black};
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    font-size: 20px;
  }

  &:hover {
    background: ${adminTheme.colors.ivory};
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;
