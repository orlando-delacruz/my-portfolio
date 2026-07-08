// src/components/admin/SideBar/SideBar.styled.js
import styled, { css } from 'styled-components';
import adminTheme from '../../../styles/adminTheme';

export const Nav = styled.nav`
  width: 100%;
  height: 100%;
  background: ${adminTheme.colors.primary};
  border-radius: 40px;
  padding: 30px 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  overflow-y: auto;
  overflow-x: hidden;

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 10px;
`;

export const BrandLogo = styled.img`
  width: 46px;
  height: 46px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const BrandName = styled.span`
  font-size: 18px;
  font-weight: 400;
  color: ${adminTheme.colors.ivory};
  font-family: 'Dancing Script', cursive;
  line-height: 1.3;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const NavItem = styled.li`
  &:last-child {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

export const NavLinkBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 400;
  color: ${adminTheme.colors.white};
  background: ${({ $active }) =>
    $active ? 'rgba(255,255,255,0.22)' : 'transparent'};
  transition: background 0.2s ease;
  text-align: left;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5;

  svg {
    font-size: 14px;
    flex-shrink: 0;
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.55);
    outline-offset: 2px;
  }

  ${({ $nested }) =>
    $nested &&
    css`
      padding-left: 40px;
      font-size: 14px;
      gap: 10px;
    `}
`;

export const ExpandIcon = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.25s ease-in-out;
  color: rgba(255, 255, 255, 0.8);
  transform: rotate(${({ $expanded }) => ($expanded ? '0deg' : '180deg')});
`;

export const SubNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  max-height: ${({ $expanded }) => ($expanded ? '500px' : '0')};
  transition: max-height 0.3s ease;
`;