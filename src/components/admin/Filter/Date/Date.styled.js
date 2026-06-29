// src/components/admin/Filter/Date/Date.styled.js
import styled from "styled-components";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
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
`;

export const IconLeft = styled.span`
  position: absolute;
  left: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  color: #222222;
  pointer-events: none;
`;

export const StyledRangePicker = styled(RangePicker)`
  width: 100%;
  border-radius: 10px !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  padding-left: 34px !important;
  box-shadow: none !important;

  .ant-picker-input > input {
    font-family: "Inter", sans-serif !important;
    font-size: 10px !important;
    line-height: 15px !important;
    color: #222222 !important;
  }

  .ant-picker-range-separator {
    font-size: 10px !important;
  }

  &:hover,
  &.ant-picker-focused {
    border-color: rgba(0, 0, 0, 0.2) !important;
    box-shadow: none !important;
  }
`;
