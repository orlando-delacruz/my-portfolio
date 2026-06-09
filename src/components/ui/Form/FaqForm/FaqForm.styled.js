import styled from "styled-components";
import { Input, Button } from "antd";
import theme from "../../../../styles/theme";

const { TextArea } = Input;

const inputBase = `
  border-radius: 50px !important;
  border: 1px solid ${theme.colors.primary} !important;
  box-shadow: none !important;
  padding: 12px 20px !important;
  font-size: ${theme.typography.size.body} !important;
  color: ${theme.colors.black} !important;
  background: ${theme.colors.white} !important;
 
  &::placeholder {
    color: #b2b2b2 !important;
  }
 
  &:hover,
  &:focus,
  &:focus-within {
    border-color: ${theme.colors.primaryDark} !important;
    box-shadow: 0 0 0 2px ${theme.colors.primary}22 !important;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
 
  /* Ant Design label override */
  .ant-form-item-label > label {
    color: ${theme.colors.black};
    font-weight: ${theme.typography.weight.medium};
  }
 
  /* Remove default Ant bottom margin on last item */
  .ant-form-item:last-child {
    margin-bottom: 0;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

export const FormTitle = styled.h3`
  font-size: 20px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const FormSubtitle = styled.p`
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.regular};
  color: ${theme.colors.black};
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.6;
`;

export const ClinicImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 14px;
`;

export const FieldLabel = styled.span`
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
`;

export const StyledInput = styled(Input)`
  ${inputBase}
`;

export const StyledTextArea = styled(TextArea)`
  border-radius: 16px !important;
  border: 1px solid ${theme.colors.primary} !important;
  box-shadow: none !important;
  padding: 14px 20px !important;
  font-size: ${theme.typography.size.body} !important;
  color: ${theme.colors.black} !important;
  background: ${theme.colors.white} !important;
  resize: none !important;
 
  &::placeholder {
    color: #b2b2b2 !important;
  }
 
  &:hover,
  &:focus {
    border-color: ${theme.colors.primaryDark} !important;
    box-shadow: 0 0 0 2px ${theme.colors.primary}22 !important;
  }
`;

export const SubmitButton = styled(Button)`
  && {
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border-radius: 50px;
    height: 44px;
    padding: 0 32px;
    font-size: ${theme.typography.size.body};
    font-weight: ${theme.typography.weight.medium};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, transform 0.15s ease;
 
    &:hover,
    &:focus {
      background: ${theme.colors.primaryDark} !important;
      border-color: ${theme.colors.primaryDark} !important;
      color: ${theme.colors.white} !important;
    }
 
    &:active {
      transform: scale(0.97);
    }
  }
`;
