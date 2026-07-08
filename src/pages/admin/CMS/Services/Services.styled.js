// src/pages/admin/CMS/Services/Services.styled.js
import styled from 'styled-components';
import adminTheme from '../../../../styles/adminTheme';

export const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.7;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CardWrapper = styled.div`
  .ant-card {
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(17, 17, 17, 0.04), 0 2px 8px rgba(17, 17, 17, 0.05);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .ant-card:hover {
    box-shadow: 0 6px 20px rgba(17, 17, 17, 0.10);
    transform: translateY(-2px);
  }

  .ant-card-cover {
    flex-shrink: 0;
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .ant-card-meta {
    flex: 1;
  }

  .ant-card-actions {
    border-top: 1px solid #f0f0f0;
    padding: 0;
    margin-top: auto;
  }
`;