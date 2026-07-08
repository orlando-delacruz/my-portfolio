// src/pages/admin/Settings/sections/AppointmentSettings/AppointmentSettings.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  .ant-select {
    width: 100%;
  }

  .ant-select-selector {
    border-radius: 5px !important;
    border-color: rgba(0, 0, 0, 0.20) !important;
    font-size: 14px !important; /* ✅ was 10px */
    height: 32px !important;
    padding: 0 8px !important;
    box-shadow: none !important;
  }

  .ant-select-selection-item {
    font-size: 14px !important; /* ✅ was 10px */
    line-height: 30px !important;
    color: ${adminTheme.colors.black} !important;
  }

  .ant-select-arrow {
    font-size: 14px !important;
  }

  .ant-select:hover .ant-select-selector,
  .ant-select-focused .ant-select-selector {
    border-color: #886217 !important;
    box-shadow: 0 0 0 2px rgba(136, 98, 23, 0.10) !important;
  }
`;

export const FieldLabel = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 14px; /* ✅ was 10px */
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 1.5;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;