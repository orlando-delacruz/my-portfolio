// src/components/ui/Fields/TextField/TextField.styled.js
import styled from "styled-components";
import theme from "../../../../styles/theme";

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: ${theme.typography.size.lg};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
`;

export const Required = styled.span`
  color: ${theme.colors.danger};
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 20px;
  border-radius: 50px;
  border: 1.5px solid
    ${({ $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
  background: ${theme.colors.white};
  font-size: ${theme.typography.size.body};
  font-family: inherit;
  color: ${theme.colors.black};
  line-height: 1.5;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #555555;
  }

  &:focus {
    border-color: ${theme.colors.primaryDark};
    box-shadow: 0 0 0 3px ${theme.colors.primary}22;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ErrorMsg = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  margin: 0;
  padding-left: 4px;
`;
