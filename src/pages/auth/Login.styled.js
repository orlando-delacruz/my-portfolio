import styled from "styled-components";
import theme from "../../styles/theme";

export const PageWrapper = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.secondary};
  padding: 20px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 760px;
  background: ${theme.colors.white};
  border-radius: 30px;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.25);
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media ${theme.media.mobile} {
    padding: 36px 24px;
    gap: 32px;
    border-radius: 20px;
  }
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const BrandLogo = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrandName = styled.span`
  color: ${theme.colors.primary};
  font-size: 28px;
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.4;

  @media ${theme.media.mobile} {
    font-size: 22px;
  }
`;

export const BrandTagline = styled.span`
  color: ${theme.colors.primaryDark};
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.regular};
  line-height: 1.5;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 0 10px;

  @media ${theme.media.mobile} {
    padding: 0;
  }
`;

export const FormTitle = styled.h1`
  text-align: center;
  color: ${theme.colors.black};
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.3;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: ${theme.colors.black};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555555;
  font-size: 18px;
  pointer-events: none;
  z-index: 1;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 52px;
  border-radius: 50px;
  border: 1.5px solid
    ${({ $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primary};
  background: ${theme.colors.white};
  font-size: ${theme.typography.size.body};
  font-family: inherit;
  color: ${theme.colors.black};
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: #555555;
    font-weight: ${theme.typography.weight.regular};
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.primaryDark};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError ? "rgba(220,38,38,0.15)" : "rgba(136,98,23,0.15)"};
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  font-size: 18px;
  padding: 4px;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.colors.danger};
  font-size: ${theme.typography.size.sm};
  margin-top: 2px;
  padding-left: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const GlobalError = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 12px 16px;
  color: ${theme.colors.danger};
  font-size: ${theme.typography.size.sm};
  text-align: center;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: 14px 30px;
  background: ${theme.colors.primary};
  border-radius: 50px;
  color: ${theme.colors.white};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  line-height: 1.5;
  transition:
    background 0.2s,
    transform 0.1s,
    opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: 12px 30px;
  border-radius: 50px;
  border: 1.5px solid ${theme.colors.black};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition:
    background 0.2s,
    border-color 0.2s;

  &:hover:not(:disabled) {
    background: ${theme.colors.gray};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const GoogleIcon = styled.img`
  width: 22px;
  height: 22px;
`;

export const ForgotLink = styled.button`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  text-align: center;
  display: block;
  margin: 0 auto;
  padding: 4px 8px;
  border-radius: 6px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.75;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #999;
  font-size: ${theme.typography.size.sm};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e5e5;
  }
`;
