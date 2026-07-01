// src\pages\admin\Calendar\sections\Toolbar\Toolbar.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  background: ${adminTheme.colors.white};
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 10px;
`;

export const NavRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;

export const NavButton = styled.button`
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${adminTheme.colors.white};
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: ${adminTheme.colors.black};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${adminTheme.colors.ivory};
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${adminTheme.colors.white};
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    font-size: 16px;
    color: ${adminTheme.colors.black};
  }

  &:hover {
    background: ${adminTheme.colors.ivory};
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const MonthLabel = styled.span`
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  color: ${adminTheme.colors.black};
`;
