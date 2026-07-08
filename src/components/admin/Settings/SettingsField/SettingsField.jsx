// src/components/admin/Settings/SettingsField/SettingsField.jsx
import { memo } from "react";
import * as S from "./SettingsField.styled";

const SettingsField = memo(({ label, value, children, editable = false }) => {
  return (
    <S.FieldWrapper>
      <S.Label>{label}</S.Label>
      {editable ? (
        children
      ) : (
        <S.Value>{value || "—"}</S.Value>
      )}
    </S.FieldWrapper>
  );
});

SettingsField.displayName = "SettingsField";
export default SettingsField;