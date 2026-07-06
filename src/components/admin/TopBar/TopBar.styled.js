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

export const DesktopHamburgerBtn = styled.button`
  ${baseHamburger}
  @media (max-width: 1024px) {
    display: none;
  }
`;

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

// ── User block (clickable) ──
export const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

// ── Avatar wrapper for fallback initials ──
export const AvatarWrapper = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${adminTheme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  font-weight: 500;
  color: ${adminTheme.colors.black};
  line-height: 1.5;
  white-space: nowrap;
`;

export const UserRole = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  line-height: 1.5;
  opacity: 0.55;
`;