// src/pages/NotFound/NotFound.styled.js
import styled, { keyframes } from 'styled-components';
import theme from '../../styles/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${theme.colors.background};
`;

export const Card = styled.div`
  max-width: 560px;
  width: 100%;
  padding: 48px 40px;
  background: ${theme.colors.white};
  border-radius: 24px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const IllustrationWrapper = styled.div`
  margin-bottom: 28px;
  display: flex;
  justify-content: center;
  animation: ${float} 4s ease-in-out infinite;
`;

export const Illustration = styled.div`
  width: 150px;
  height: 150px;
  background: ${theme.colors.secondary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: ${theme.colors.primary};
  font-weight: 700;
  line-height: 1;
`;

export const ErrorCode = styled.div`
  font-size: 72px;
  font-weight: 700;
  color: ${theme.colors.primary};
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${theme.colors.black};
  margin: 0 0 12px 0;
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.primaryDark};
  line-height: 1.6;
  margin: 0 0 32px 0;
  opacity: 0.8;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const PrimaryButton = styled.button`
  padding: 12px 32px;
  border-radius: 50px;
  border: none;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  min-width: 160px;

  &:hover {
    background: ${theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const SecondaryButton = styled.button`
  padding: 12px 32px;
  border-radius: 50px;
  border: 1px solid ${theme.colors.primary};
  background: transparent;
  color: ${theme.colors.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  min-width: 160px;

  &:hover {
    background: ${theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 3px;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;