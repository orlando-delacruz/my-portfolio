// src/components/admin/Settings/SettingsCard/SettingsCard.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const Card = styled.div`
  width: 100%;
  padding: 10px;
  background: ${adminTheme.colors.white};
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid rgba(136, 98, 23, 0.20);
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;

  ${({ $variant }) =>
    $variant === "highlighted" &&
    css`
      outline: 1px solid ${adminTheme.colors.primary};
    `}
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const IconWrapper = styled.div`
  padding: 10px;
  background: ${adminTheme.colors.champagne};
  overflow: hidden;
  border-radius: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: ${adminTheme.colors.white};
  }
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const Title = styled.div`
  color: ${adminTheme.colors.black};
  font-size: 14px; /* ✅ was 12px */
  font-family: "Inter", sans-serif;
  font-weight: 500;
  word-wrap: break-word;
`;

export const Subtitle = styled.div`
  color: ${adminTheme.colors.black};
  font-size: 14px; /* ✅ was 10px */
  font-family: "Inter", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  opacity: 0.7;
`;