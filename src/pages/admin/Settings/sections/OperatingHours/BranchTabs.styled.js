// src/pages/admin/Settings/sections/OperatingHours/BranchTabs.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const TabsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;               /* prevent wrapping */
  overflow-x: auto;                /* enable horizontal scroll */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch; /* smooth scrolling on iOS */
  gap: 10px;
  padding: 5px 5px 0 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.20);

  /* Hide scrollbar for cleaner look (optional) */
  scrollbar-width: none;           /* Firefox */
  &::-webkit-scrollbar {
    display: none;                 /* Chrome, Safari, Edge */
  }

  /* Ensure scrollable area is visible on touch devices */
  @media (max-width: 768px) {
    padding: 5px 10px 0 10px;      /* more horizontal padding for touch */
  }
`;

export const TabButton = styled.button`
  flex-shrink: 0;                  /* prevent tab from shrinking */
  white-space: nowrap;             /* keep label on one line */
  padding: 5px 15px;
  border-radius: 10px 10px 0 0;
  border: none;
  background: transparent;
  font-size: 10px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  color: ${({ $active }) => ($active ? adminTheme.colors.primary : adminTheme.colors.black)};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  border-bottom: 2px solid ${({ $active }) => ($active ? adminTheme.colors.primary : "transparent")};
  padding-bottom: 8px;

  ${({ $active }) =>
    $active &&
    css`
      background: rgba(136, 98, 23, 0.10);
    `}

  &:hover:not(:disabled) {
    background: rgba(136, 98, 23, 0.05);
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;