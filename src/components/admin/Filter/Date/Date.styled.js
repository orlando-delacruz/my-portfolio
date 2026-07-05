// src/components/admin/Filter/Date/Date.styled.js
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
  min-width: 0;
`;

export const Label = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #222222;
`;

export const PickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

export const IconLeft = styled.span`
  position: absolute;
  left: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  color: #222222;
  pointer-events: none;

  @media (max-width: 576px) {
    display: none;
  }
`;

export const DatePickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding-left: 32px;

  .ant-picker {
    flex: 1;
    min-width: 0;
    border-radius: 10px !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    padding: 7px 11px;
    height: 37px;
    box-shadow: none !important;
    background: #ffffff;
  }

  .ant-picker-focused,
  .ant-picker:hover {
    border-color: rgba(0, 0, 0, 0.2) !important;
  }

  .ant-picker-input > input {
    font-family: "Inter", sans-serif !important;
    font-size: 10px !important;
    line-height: 15px !important;
    color: #222222 !important;
  }

  .separator {
    color: #888;
    font-weight: 300;
    flex-shrink: 0;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 6px;
    padding-left: 0;
    .separator {
      display: none;
    }
    .ant-picker {
      width: 100% !important;
    }
  }
`;
