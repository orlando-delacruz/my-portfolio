// src/pages/admin/Appointment/Appointment.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";

export const PageContainer = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }

  /* Spacing between sections */
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SelectionToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid ${adminTheme.colors.primary};
  margin-bottom: 8px;
  gap: 16px;
  flex-wrap: wrap;
`;

export const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${adminTheme.colors.black};

  span {
    background: ${adminTheme.colors.primary};
    color: #fff;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 13px;
  }
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: ${({ $loading }) => ($loading ? "#f5f5f5" : "#dc2626")};
  color: ${({ $loading }) => ($loading ? "#999" : "#fff")};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: ${({ $loading }) => ($loading ? "not-allowed" : "pointer")};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #b91c1c;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    font-size: 18px;
  }
`;
