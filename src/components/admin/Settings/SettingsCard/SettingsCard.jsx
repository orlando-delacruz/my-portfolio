// src/components/admin/Settings/SettingsCard/SettingsCard.jsx
import { memo } from "react";
import * as S from "./SettingsCard.styled";

const SettingsCard = memo(({ icon: Icon, title, subtitle, children, variant = "default" }) => {
  return (
    <S.Card $variant={variant}>
      <S.Header>
        <S.IconWrapper>
          <Icon aria-hidden="true" />
        </S.IconWrapper>
        <S.HeaderText>
          <S.Title>{title}</S.Title>
          <S.Subtitle>{subtitle}</S.Subtitle>
        </S.HeaderText>
      </S.Header>
      {children}
    </S.Card>
  );
});

SettingsCard.displayName = "SettingsCard";
export default SettingsCard;