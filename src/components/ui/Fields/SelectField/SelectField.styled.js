// src/components/ui/Fields/SelectField/SelectField.styled.js
import styled from "styled-components";
import { Select } from "antd";
import theme from "../../../../styles/theme";

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${theme.typography.size.lg};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
  margin-bottom: 4px;
`;

export const Required = styled.span`
  color: ${theme.colors.danger};
`;

export const StyledSelect = styled(Select)`
  .ant-select-selector {
    border-radius: 50px !important;
    border: 1.5px solid
      ${({ status }) =>
        status === "error"
          ? theme.colors.danger
          : theme.colors.primary} !important;
    background: ${theme.colors.white} !important;
    height: 44px !important;
    padding: 0 20px !important;
    display: flex !important;
    align-items: center !important;
    box-shadow: none !important;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease !important;
  }

  .ant-select-selector:hover,
  &.ant-select-focused .ant-select-selector {
    border-color: ${theme.colors.primaryDark} !important;
    box-shadow: 0 0 0 3px ${theme.colors.primary}22 !important;
  }

  .ant-select-selection-item {
    font-family: inherit !important;
    font-size: 16px !important;
    color: ${theme.colors.black} !important;
    line-height: 1.5 !important;
  }

  .ant-select-selection-placeholder {
    font-family: inherit !important;
    font-size: 16px !important;
    color: #555555 !important;
  }

  &.ant-select-disabled .ant-select-selector {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .ant-select-arrow {
    color: ${theme.colors.primary} !important;
    font-size: 20px !important;
    right: 16px !important;
  }

  &.ant-select-status-error .ant-select-selector {
    border-color: ${theme.colors.danger} !important;
  }

  &.ant-select-status-error .ant-select-selector:hover,
  &.ant-select-status-error.ant-select-focused .ant-select-selector {
    border-color: ${theme.colors.danger} !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.13) !important;
  }
`;

export const ErrorMsg = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  margin: 0;
  padding-left: 4px;
`;
