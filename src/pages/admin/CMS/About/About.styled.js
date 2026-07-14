// src/pages/admin/CMS/About/About.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

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

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 24px;
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

export const Card = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  padding: 24px;
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

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 16px 0 12px 0;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const ImageUploadWrapper = styled.div`
  .ant-upload-picture-card-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ant-upload-list-picture-card .ant-upload-list-item {
    width: 100%;
    max-width: 200px;
    height: 200px;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    .ant-upload-list-picture-card .ant-upload-list-item {
      max-width: 100%;
      height: 160px;
    }
  }
`;
