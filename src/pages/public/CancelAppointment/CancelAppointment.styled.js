// src/pages/public/CancelAppointment/CancelAppointment.styled.js
import styled from "styled-components";
import theme from "../../../styles/theme";

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.secondary};
  padding: 20px;
`;

export const Card = styled.div`
  max-width: 500px;
  width: 100%;
  background: #fff;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

export const BrandName = styled.h1`
  font-size: 24px;
  color: ${theme.colors.primary};
  margin: 0;
`;

export const Title = styled.h2`
  text-align: center;
  color: #222;
  font-weight: 600;
  margin: 0;
`;

export const AppointmentSummary = styled.div`
  background: ${theme.colors.ivory};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &:last-child {
    border-bottom: none;
  }
`;

export const SummaryLabel = styled.span`
  color: #555;
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  color: #222;
  font-weight: 600;
`;

export const Warning = styled.p`
  text-align: center;
  color: #dc2626;
  font-size: 15px;
  background: #fef2f2;
  padding: 12px;
  border-radius: 8px;
  margin: 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CancelBtn = styled.button`
  padding: 14px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover:not(:disabled) {
    background: #b91c1c;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const BackBtn = styled.button`
  padding: 12px;
  background: transparent;
  color: #886217;
  border: 1px solid #886217;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s;
  &:hover {
    background: #f8f7f3;
  }
`;

export const BackLink = styled.a`
  display: inline-block;
  margin-top: 12px;
  color: #886217;
  text-decoration: underline;
  text-align: center;
`;

export const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

export const ErrorIcon = styled.div`
  font-size: 48px;
  text-align: center;
`;

export const ErrorTitle = styled.h3`
  text-align: center;
  color: #dc2626;
  margin: 0;
`;

export const ErrorMessage = styled.p`
  text-align: center;
  color: #555;
`;
