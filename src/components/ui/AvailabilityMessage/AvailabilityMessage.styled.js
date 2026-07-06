// src/components/ui/AvailabilityMessage/AvailabilityMessage.styled.js
import styled from "styled-components";

export const WarningCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 18px;
  background: #fefaf0;
  border: 1px solid #fde8c8;
  border-radius: 10px;
  margin: 8px 0;
  width: 100%;
  transition: background 0.2s;
`;

export const CardIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #e67e22;
  margin-top: 2px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const CardTitle = styled.strong`
  font-size: 14px;
  font-weight: 600;
  color: #222222;
  margin: 0;
  line-height: 1.4;
`;

export const CardDescription = styled.span`
  font-size: 13px;
  color: #686868;
  line-height: 1.5;
  margin: 0;
`;