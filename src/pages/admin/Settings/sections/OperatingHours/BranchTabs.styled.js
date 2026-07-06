// src/pages/admin/Settings/sections/OperatingHours/BranchTabs.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.20);
`;

export const Tab = styled.button`
  padding: 5px 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 400;
  transition: all 0.2s ease;

  ${({ $active }) =>
    $active
      ? css`
          background: rgba(136, 98, 23, 0.20);
          color: ${adminTheme.colors.primary};
          border-bottom: 1.5px solid ${adminTheme.colors.primary};
        `
      : css`
          background: transparent;
          color: ${adminTheme.colors.black};
          &:hover {
            background: rgba(136, 98, 23, 0.08);
          }
        `}

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;