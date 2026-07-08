// src/components/admin/Filter/Source/Source.styled.js
import styled from "styled-components";
import { Select } from "antd";

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

export const SelectWrapper = styled.div`
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

export const StyledSelect = styled(Select)`
  width: 100%;

  .ant-select-selector {
    border-radius: 10px !important;
    border: 1px solid rgba(0, 0, 0, 0.10) !important;
    padding-left: 32px !important;
    font-family: "Inter", sans-serif !important;
    font-size: 10px !important;
    height: 37px !important;
    align-items: center !important;
    box-shadow: none !important;
  }

  .ant-select-selection-item {
    font-size: 10px !important;
    line-height: 15px !important;
    color: #222222 !important;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: rgba(0, 0, 0, 0.20) !important;
    box-shadow: none !important;
  }
`;