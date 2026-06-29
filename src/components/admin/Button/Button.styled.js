// src/components/admin/Button/Button.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../styles/adminTheme";

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  transition:
    background 0.2s ease,
    opacity 0.2s ease;

  ${({ $variant }) =>
    $variant === "primary" &&
    css`
      background: ${adminTheme.colors.primary};
      color: ${adminTheme.colors.white};

      &:hover:not(:disabled) {
        background: ${adminTheme.colors.primaryDark};
      }
    `}

  ${({ $variant }) =>
    $variant === "secondary" &&
    css`
      background: ${adminTheme.colors.ivory};
      color: ${adminTheme.colors.black};
      border: 1px solid rgba(0, 0, 0, 0.1);

      &:hover:not(:disabled) {
        background: ${adminTheme.colors.champagne};
      }
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;
