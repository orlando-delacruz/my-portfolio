// src/pages/admin/Settings/Settings.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";

export const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 35px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 24px;
  }
`;

export const PageHeader = styled.div`
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    padding: 0 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PageTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.3;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.7;
`;

export const ErrorContainer = styled.div`
  padding: 0 24px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// ── 2-Column Grid Layout ──
export const ContentGrid = styled.div`
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* ✅ 2 columns on large screens */
  gap: 14px;

  // Tablet / Mobile: 1 column
  @media (max-width: 768px) {
    padding: 0 16px;
    grid-template-columns: 1fr;
  }
`;