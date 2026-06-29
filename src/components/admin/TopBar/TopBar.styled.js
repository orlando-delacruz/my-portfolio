// src/components/admin/TopBar/TopBar.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../styles/adminTheme";

export const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
  height: 64px;
  background: ${adminTheme.colors.ivory};
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.1);
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// Base button style shared by desktop and mobile toggles
const baseHamburger = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  cursor: pointer;
  color: ${adminTheme.colors.black};
  font-size: 20px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

// Desktop toggle (visible above 1024px)
export const DesktopHamburgerBtn = styled.button`
  ${baseHamburger}

  @media (max-width: 1024px) {
    display: none;
  }
`;

// Mobile toggle (visible at 1024px and below)
export const MobileHamburgerBtn = styled.button`
  ${baseHamburger}
  display: none;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const NotifButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${adminTheme.colors.black};
  font-size: 24px;
  display: flex;
  align-items: center;
  padding: 4px;

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

export const NotifBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f81313;
  border: 1.5px solid ${adminTheme.colors.ivory};
`;

export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UserAvatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const UserName = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  line-height: 1.5;
  white-space: nowrap;
`;

export const UserRole = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  line-height: 1.5;
  opacity: 0.55;
`;
