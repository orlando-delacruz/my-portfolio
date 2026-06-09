// src/pages/public/Home/sections/Services/Services.styled.js
import styled, { keyframes, css } from "styled-components";
import theme from "../../../../../styles/theme";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Section ─────────────────────────────────────────── */
export const ServicesSection = styled.section`
  padding: 112px 65px 80px;
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: 50px;
  overflow: hidden;

  @media ${theme.media.tablet} {
    padding: 80px 30px 60px;
    gap: 40px;
  }

  @media ${theme.media.mobile} {
    padding: 60px 20px 50px;
    gap: 32px;
  }
`;

/* ─── Body ────────────────────────────────────────────── */
export const ServicesBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 35px;
`;

/* ─── Branch tabs ─────────────────────────────────────── */
export const TabRow = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  padding: 10px;
  width: 100%;

  @media ${theme.media.mobile} {
    gap: 24px;
  }
`;

export const TabButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  padding-bottom: 5px;
  transition: color 0.2s ease;

  ${({ $active }) =>
    $active
      ? css`
          color: ${theme.colors.primary};
          border-bottom: 2px solid ${theme.colors.primary};
        `
      : css`
          color: ${theme.colors.black};
          border-bottom: 2px solid transparent;

          &:hover {
            color: ${theme.colors.primary};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

/* ─── Cards grid ──────────────────────────────────────── */
export const CardsWrapper = styled.div`
  width: 100%;
  padding: 5px;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  animation: ${fadeUp} 0.5s ease both;

  @media ${theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

/* ─── View all toggle ─────────────────────────────────── */
export const ViewAllButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
  font-size: 20px;
  font-weight: ${theme.typography.weight.regular};
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s ease;
  align-self: center;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;