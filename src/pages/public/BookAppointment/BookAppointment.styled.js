// src/pages/public/BookAppointment/BookAppointment.styled.js
import styled from "styled-components";
import theme from "../../../styles/theme";

export const PageWrapper = styled.div`
  min-height: 100dvh;
  background: ${theme.colors.white};
  display: flex;
  flex-direction: column;
  padding-bottom: 112px;
`;

/* ─── Top nav bar ─────────────────────────────────────── */
export const TopBar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 18px 65px;
  background: ${theme.colors.white};
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;

  @media ${theme.media.tablet} {
    padding: 16px 30px;
  }

  @media ${theme.media.mobile} {
    padding: 14px 20px;
  }
`;

export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
  font-size: 20px;
  font-weight: ${theme.typography.weight.medium};
  font-family: inherit;
  line-height: 1.5;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

export const BackIconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50px;
  border: 1.5px solid ${theme.colors.primary};
  font-size: 18px;
  color: ${theme.colors.primary};
  flex-shrink: 0;
`;

/* ─── Page content ────────────────────────────────────── */
export const PageContent = styled.main`
  flex: 1;
  padding: 40px 65px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media ${theme.media.tablet} {
    padding: 32px 30px;
  }

  @media ${theme.media.mobile} {
    padding: 24px 20px;
  }
`;
