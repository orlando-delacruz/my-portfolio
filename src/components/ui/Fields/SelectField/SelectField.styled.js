// src/components/ui/Fields/SelectField/SelectField.styled.js
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
  margin-bottom: 4px; /* added to match FieldLabel */
`;

export const Required = styled.span`
  color: ${theme.colors.danger};
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Select = styled.select`
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  padding: 10px 48px 10px 20px;
  border-radius: 50px;
  border: 1.5px solid
    ${({ $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
  background: ${theme.colors.white};
  font-size: ${theme.typography.size.body};
  font-family: inherit;
  color: ${({ $empty }) => ($empty ? "#555555" : theme.colors.black)};
  line-height: 1.5;
  cursor: pointer;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  height: 44px; /* fixed height to match DatePicker */
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.colors.primaryDark};
    box-shadow: 0 0 0 3px ${theme.colors.primary}22;
  }
`;

export const ChevronIcon = styled.span`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${theme.colors.black};
  font-size: 20px;
  display: flex;
  align-items: center;
`;

export const ErrorMsg = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.danger};
  margin: 0;
  padding-left: 4px;
`;
