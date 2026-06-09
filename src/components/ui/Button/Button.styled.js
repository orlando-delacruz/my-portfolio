// src/components/ui/Button/Button.styled.js
import styled, { css } from "styled-components";
import theme from "../../../styles/theme"

const variants = {
  primary: css`
    background: ${theme.colors.primary};
    color: white;

    &:hover {
      background: ${theme.colors.primaryDark};
    }
  `,

  danger: css`
    background: ${theme.colors.danger};
    color: white;

    &:hover {
      background: ${theme.colors.dangerDark};
    }
  `,

  success: css`
    background: #16a34a;
    color: white;

    &:hover {
      background: #15803d;
    }
  `,

  outline: css`
    background: transparent;
    border: 1px solid ${theme.colors.primary};
    color: ${theme.colors.primary};

    &:hover {
      background: ${theme.colors.primary};
      color: ${theme.colors.white};
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.625rem 1.25rem;
    font-size: ${theme.typography.size.lg};
    font-weight: ${theme.typography.weight.regular};
  `,

  md: css`
    padding: 0.75rem 1rem;
    font-size: 1rem;
  `,

  lg: css`
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
  `,
};

export const StyledButton = styled.button`
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  ${({ variant }) => variants[variant]}
  ${({ size }) => sizes[size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;