// src/components/admin/Button/Button.jsx
import { memo } from "react";
import * as S from "./Button.styled";

/**
 * @param {ReactNode} icon
 * @param {string}    label
 * @param {string}    variant
 * @param {function}  onClick
 * @param {string}    type
 * @param {boolean}   disabled
 */
const Button = ({
  icon,
  label,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  ...rest
}) => (
  <S.StyledButton
    type={type}
    $variant={variant}
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    {...rest}
  >
    {icon && <S.IconWrapper aria-hidden="true">{icon}</S.IconWrapper>}
    <span>{label}</span>
  </S.StyledButton>
);

export default memo(Button);