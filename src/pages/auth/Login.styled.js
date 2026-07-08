// src/pages/auth/Login.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.main`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, #faf8f4 100%);
  padding: clamp(16px, 4vw, 40px);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 760px;
  background: ${theme.colors.white};
  border-radius: clamp(24px, 4vw, 32px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(136, 98, 23, 0.06);
  padding: clamp(24px, 4vw, 32px) clamp(20px, 5vw, 48px) clamp(24px, 4vw, 40px);
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 24px);
  animation: ${fadeIn} 0.6s ease-out;
`;

export const TopNav = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2px;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2vw, 14px);
  margin-top: clamp(4px, 1vw, 8px);
`;

export const BrandLogo = styled.img`
  width: clamp(56px, 10vw, 70px);
  height: clamp(56px, 10vw, 70px);
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
  /* ✅ box-shadow removed */
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrandName = styled.span`
  color: ${theme.colors.primary};
  font-size: clamp(22px, 5vw, 28px);
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

export const BrandTagline = styled.span`
  color: ${theme.colors.primaryDark};
  font-size: clamp(14px, 2vw, 16px);
  font-weight: ${theme.typography.weight.regular};
  line-height: 1.5;
  opacity: 0.8;
`;

export const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 4vw, 28px);
  padding: 0 clamp(0px, 1vw, 4px);
`;

export const FormTitle = styled.h1`
  text-align: center;
  color: ${theme.colors.black};
  font-size: clamp(28px, 6vw, 40px);
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.02em;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  color: ${theme.colors.black};
  font-size: clamp(15px, 1.8vw, 18px);
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
  padding: clamp(12px, 1.5vw, 15px) 20px clamp(12px, 1.5vw, 15px) 52px;
  border-radius: 50px;
  border: 1.5px solid
    ${({ $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.primary};
  background: ${theme.colors.white};
  font-size: clamp(15px, 1.8vw, 16px);
  font-family: inherit;
  color: ${theme.colors.black};
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #999999;
    font-weight: 400;
  }

  &:focus {
    border-color: ${({ $hasError }) =>
    $hasError ? theme.colors.danger : theme.colors.primaryDark};
    box-shadow: 0 0 0 4px
      ${({ $hasError }) =>
    $hasError ? "rgba(220,38,38,0.12)" : "rgba(136,98,23,0.12)"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  background: none;
  border: none;
  cursor: pointer;

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
  font-size: clamp(13px, 1.5vw, 14px);
  margin-top: 4px;
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
  font-size: clamp(13px, 1.5vw, 14px);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const LoginButton = styled.button`
  width: 100%;
  padding: clamp(12px, 1.5vw, 14px) 30px;
  background: ${theme.colors.primary};
  border-radius: 50px;
  color: ${theme.colors.white};
  font-size: clamp(15px, 1.8vw, 16px);
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  line-height: 1.5;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(136, 98, 23, 0.25);

  &:hover:not(:disabled) {
    background: ${theme.colors.primaryDark};
    box-shadow: 0 6px 20px rgba(136, 98, 23, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const GoogleButton = styled.button`
  width: 100%;
  padding: clamp(10px, 1.2vw, 12px) 30px;
  border-radius: 50px;
  border: 1.5px solid ${theme.colors.black};
  background: ${theme.colors.white};
  color: ${theme.colors.black};
  font-size: clamp(15px, 1.8vw, 16px);
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f8f8f8;
    border-color: ${theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  svg {
    flex-shrink: 0;
  }
`;

export const ForgotLink = styled.button`
  color: ${theme.colors.primary};
  font-size: clamp(15px, 1.8vw, 16px);
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  text-align: center;
  display: block;
  margin: 0 auto;
  padding: 4px 8px;
  border-radius: 6px;
  transition: opacity 0.2s, text-decoration 0.2s;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }
`;

export const BackHomeLink = styled.button`
  color: ${theme.colors.primary};
  font-size: clamp(14px, 1.5vw, 15px);
  font-weight: 400;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: opacity 0.2s, background 0.2s;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    font-size: 16px;
  }

  &:hover {
    opacity: 0.7;
    background: rgba(136, 98, 23, 0.04);
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
  font-size: clamp(13px, 1.5vw, 14px);

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }
`;