// src/pages/admin/Appointment/sections/PageTitle/PageTitle.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.gray};
  margin: 0;
  line-height: 1.5;
  opacity: 0.75;
`;