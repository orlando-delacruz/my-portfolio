// src/components/admin/Settings/SettingsField/SettingsField.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const FieldWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
`;

export const Label = styled.span`
  color: rgba(0, 0, 0, 0.50);
  font-size: 16px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
`;

export const Value = styled.span`
  width: 100%;
  padding: 5px;
  overflow: hidden;
  border-radius: 5px;
  outline: 1px solid rgba(0, 0, 0, 0.20);
  outline-offset: -1px;
  color: ${adminTheme.colors.black};
  font-size: 14px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  background: ${adminTheme.colors.white};
  min-height: 28px;
  display: flex;
  align-items: center;
`;