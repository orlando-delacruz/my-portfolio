// src\pages\admin\Calendar\sections\PageTitle\PageTitle.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const TitleBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Heading = styled.h1`
  font-family: Inter, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  margin: 0;
`;
