// src/pages/admin/CMS/Services/Services.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 24px;
`;

export const Container = styled.div`
  padding: 24px;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.7;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0 0 16px 0;
`;

export const Card = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow:
    0 1px 2px rgba(17, 17, 17, 0.04),
    0 2px 8px rgba(17, 17, 17, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const CardWrapper = styled.div`
  min-width: 0;
  overflow: hidden;
  height: 100%;

  .ant-card {
    border-radius: 12px;
    box-shadow:
      0 1px 2px rgba(17, 17, 17, 0.04),
      0 2px 8px rgba(17, 17, 17, 0.05);
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .ant-card:hover {
    box-shadow: 0 6px 20px rgba(17, 17, 17, 0.1);
    transform: translateY(-2px);
  }

  .ant-card-cover {
    flex-shrink: 0;
    overflow: hidden;
    padding: 0;
  }

  .ant-card-cover > * {
    display: block;
    width: 100%;
    height: 160px;
    object-fit: cover;
  }

  .ant-card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px;
    overflow: hidden;
  }

  .ant-card-meta {
    flex: 1;
    min-width: 0;
  }

  .ant-card-meta-title {
    font-size: 15px;
    font-weight: 600;
    color: ${adminTheme.colors.black};
    margin-bottom: 4px;
    white-space: normal;
    word-wrap: break-word;
  }

  .ant-card-meta-description {
    font-size: 13px;
    color: ${adminTheme.colors.gray};
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ant-card-actions {
    border-top: 1px solid #f0f0f0;
    padding: 0;
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
  }

  .ant-card-actions > li {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    min-width: 0;
    padding: 8px 4px;
  }

  .ant-card-actions > li > .anticon {
    font-size: 16px;
  }

  .ant-tag {
    font-size: 11px;
    padding: 1px 8px;
    margin: 2px 4px 2px 0;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    .ant-card-cover > * {
      height: 140px;
    }

    .ant-card-body {
      padding: 14px;
    }

    .ant-card-meta-title {
      font-size: 14px;
    }

    .ant-card-meta-description {
      font-size: 12px;
    }

    .ant-card-actions > li {
      padding: 10px 4px;
    }
  }

  @media (max-width: 480px) {
    .ant-card-cover > * {
      height: 120px;
    }

    .ant-card-body {
      padding: 12px;
    }

    .ant-card-actions {
      flex-wrap: wrap;
    }

    .ant-card-actions > li {
      flex: 1 0 50%;
      padding: 12px 4px;
      border-right: 1px solid #f0f0f0;

      &:nth-child(2n) {
        border-right: none;
      }

      &:last-child {
        border-right: none;
      }
    }
  }
`;

export const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ServiceTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 0;
  color: ${adminTheme.colors.gray};
  font-size: 16px;
`;
