// src/components/admin/Settings/ToggleSwitch/ToggleSwitch.jsx
import { memo } from "react";
import { Switch } from "antd";
import * as S from "./ToggleSwitch.styled";

const ToggleSwitch = memo(({ checked, onChange, label, description, disabled = false }) => {
  return (
    <S.Wrapper>
      <S.Left>
        <S.Label>{label}</S.Label>
        {description && <S.Description>{description}</S.Description>}
      </S.Left>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{
          backgroundColor: checked ? "#886217" : undefined,
        }}
      />
    </S.Wrapper>
  );
});

ToggleSwitch.displayName = "ToggleSwitch";
export default ToggleSwitch;