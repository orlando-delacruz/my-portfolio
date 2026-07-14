// src/components/common/Loading/Loading.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: ${fadeIn} 0.3s ease-in;

  ${({ $fullscreen }) =>
    $fullscreen &&
    `
    position: fixed;
    inset: 0;
    background: ${theme.colors.background};
    z-index: 1000;
  `}

  ${({ $fullscreen }) =>
    !$fullscreen &&
    `
    min-height: 200px;
    padding: 24px;
  `}
`;

export const Spinner = styled.div`
  width: ${({ $size }) => {
    switch ($size) {
      case "small":
        return "32px";
      case "large":
        return "56px";
      default:
        return "44px";
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case "small":
        return "32px";
      case "large":
        return "56px";
      default:
        return "44px";
    }
  }};
  border: 4px solid ${theme.colors.primary}20;
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  opacity: 0.7;
  margin: 0;
  text-align: center;
`;
