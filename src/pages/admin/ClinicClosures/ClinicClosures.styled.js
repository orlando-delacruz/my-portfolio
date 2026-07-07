// src/pages/admin/ClinicClosures/ClinicClosures.styled.js
import styled from "styled-components";
import { Button } from "antd";

export const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const FloatingDeleteButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 50px;
  padding: 12px 28px;
  height: auto;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeUp 0.25s ease-out;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 640px) {
    bottom: 20px;
    padding: 10px 20px;
    font-size: 14px;
    width: auto;
    min-width: 120px;
    justify-content: center;
  }
`;