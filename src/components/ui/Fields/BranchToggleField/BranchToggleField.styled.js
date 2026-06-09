// src/components/ui/Fields/BranchToggleField/BranchToggleField.styled.js
import styled, { css } from "styled-components";
import theme from "../../../../styles/theme";

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

export const Label = styled.span`
  font-size: 20px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
`;

export const Required = styled.span`
  color: ${theme.colors.danger};
`;

export const ToggleGroup = styled.div`
  display: flex;
  gap: 24px;

  @media ${theme.media.mobile} {
    flex-direction: column;
    gap: 10px;
  }
`;
export const ToggleButton = styled.button`
  width: 100%;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: ${theme.typography.size.body};
  font-family: inherit;
  font-weight: ${theme.typography.weight.regular};
  line-height: 1.5;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
  text-align: center;

  ${({ $active }) =>
    $active
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: 1.5px solid ${theme.colors.primary};
        `
      : css`
          background: ${theme.colors.white};
          color: #555555;
          border: 1.5px solid ${theme.colors.primary};

          &:hover {
            background: ${theme.colors.secondary};
            color: ${theme.colors.primary};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const ErrorMsg = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  margin: 0;
  padding-left: 4px;
`;
