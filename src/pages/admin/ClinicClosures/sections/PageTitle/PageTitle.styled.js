// src/pages/admin/ClinicClosures/sections/PageTitle/PageTitle.styled.js
import styled from "styled-components";

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const Title = styled.h1`
  font-family: "Inter", sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #222222;
  margin: 0;
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #222222;
  margin: 0;
  opacity: 0.7;
`;
