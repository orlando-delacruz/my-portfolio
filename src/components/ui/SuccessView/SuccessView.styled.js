import styled, { keyframes } from "styled-components";
import theme from "../../../styles/theme";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const SuccessBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 40px 20px;
  animation: ${fadeIn} 0.4s ease both;
`;

export const SuccessIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: ${theme.colors.primary};
`;

export const SuccessTitle = styled.h2`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.semibold};
  color: ${theme.colors.primary};
  margin: 0;
`;

export const SuccessBody = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  max-width: 460px;
  opacity: 0.85;
  margin: 0;
`;
