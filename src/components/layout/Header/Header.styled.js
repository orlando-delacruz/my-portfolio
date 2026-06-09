// src/components/layout/Header/Header.styled.js
import styled, { css } from "styled-components";
import theme from "../../../styles/theme";

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: ${theme.colors.white};
  width: 100%;
  transition: box-shadow 0.25s ease;

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      box-shadow: 1px 1px 10px ${theme.colors.overlay};
    `}
`;

export const Navbar = styled.nav`
  max-width: 1440px;
  margin: 0 auto;
  padding: 10px 65px;
  background: ${theme.colors.white};
  box-shadow: 1px 1px 10px ${theme.colors.overlay};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${theme.media.tablet} {
    padding: 10px 32px;
  }

  @media ${theme.media.mobile} {
    padding: 10px 20px;
  }
`;

/* ── Logo ── */
export const LogoWrapper = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
`;

export const LogoImage = styled.img`
  max-width: 39px;
  max-height: 65px;
  object-fit: cover;
`;

export const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const LogoName = styled.span`
  color: ${theme.colors.primaryDark};
  font-size: ${theme.typography.heading.h4};
  font-family: "Poppins", sans-serif;
  font-weight: ${theme.typography.weight.semibold};
  line-height: 36px;
  white-space: nowrap;

  @media ${theme.media.tablet} {
    font-size: ${theme.typography.size.md};
    line-height: 28px;
  }
`;

export const LogoTagline = styled.span`
  color: ${theme.colors.primaryDark};
  font-size: ${theme.typography.size.body};
  font-family: "Poppins", sans-serif;
  font-weight: ${theme.typography.weight.regular};
  line-height: 24px;
`;

/* ── Banner ── */
export const Banner = styled.div`
  background-color: ${theme.colors.primaryDark};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 65px;
  

  .contacts {
    color: ${theme.colors.white};
    font-family: "Poppins", sans-serif;
    font-size: ${theme.typography.size.sm};
    text-decoration: none;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }

    &:focus-visible {
      outline: 2px solid ${theme.colors.white};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  .operating-hours {
    color: ${theme.colors.white};
    font-family: "Poppins", sans-serif;
    font-size: ${theme.typography.size.sm};
    margin: 0;
  }

  .left-details {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .right-details {
    display: flex;
    align-items: center;
    gap: 16px;

    .social-link {
      color: ${theme.colors.white};
      font-size: ${theme.typography.size.body};
      display: flex;
      align-items: center;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  @media ${theme.media.tablet} {
    padding: 8px 32px;
  }

  @media ${theme.media.mobile} {
    padding: 8px 20px;
    flex-direction: column;
    gap: 4px;
    text-align: center;

    .left-details,
    .right-details {
      gap: 12px;
    }
  }
`;

/* ── Nav Links ── */
export const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media ${theme.media.tablet} {
    display: none;
  }
`;

export const NavItem = styled.li``;

export const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ $active }) => ($active ? theme.colors.primaryDark : theme.colors.black)};
  font-size: ${theme.typography.size.lg};
  font-family: "Poppins", sans-serif;
  font-weight: ${theme.typography.weight.regular};
  line-height: 30px;
  text-decoration: none;
  border-bottom: ${({ $active }) =>
    $active ? `2px solid ${theme.colors.primaryDark}` : "2px solid transparent"};
  padding-bottom: 2px;
  transition: color 0.2s ease, border-color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primaryDark};
    border-bottom-color: ${theme.colors.primaryDark};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primaryDark};
    outline-offset: 3px;
    border-radius: 2px;
  }
`;

export const ChevronIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${theme.colors.black};
  font-size: ${theme.typography.size.xs};
`;

/* ── Mobile Hamburger ── */
export const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primaryDark};
  font-size: ${theme.typography.size.xl};
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: ${theme.colors.secondary};
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primaryDark};
    outline-offset: 3px;
  }

  @media ${theme.media.tablet} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ── Mobile Drawer ── */
export const MobileDrawer = styled.div`
  display: none;
  flex-direction: column;
  background: ${theme.colors.white};
  padding: 16px 20px 24px;
  border-top: 1px solid ${theme.colors.secondary};

  @media ${theme.media.tablet} {
    display: ${({ $open }) => ($open ? "flex" : "none")};
  }
`;

export const MobileNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ $active }) => ($active ? theme.colors.primaryDark : theme.colors.black)};
  font-size: ${theme.typography.size.md};
  font-family: "Poppins", sans-serif;
  font-weight: ${({ $active }) =>
    $active ? theme.typography.weight.semibold : theme.typography.weight.regular};
  text-decoration: none;
  padding: 12px 0;
  border-bottom: 1px solid ${theme.colors.gray};
  transition: color 0.2s ease;
  cursor: pointer;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    color: ${theme.colors.primaryDark};
  }
`;

export const MobileBookButton = styled.div`
  margin-top: 16px;
`;