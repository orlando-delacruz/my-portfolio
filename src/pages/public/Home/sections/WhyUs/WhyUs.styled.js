// src/pages/public/Home/sections/WhyUs/WhyUs.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../../styles/theme";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Section ─────────────────────────────────────────── */
export const WhyUsSection = styled.section`
  background: ${theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: 50px;
  overflow: hidden;
`;

/* ─── Cards grid ──────────────────────────────────────── */
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 5px;
  animation: ${fadeUp} 0.6s 0.1s ease both;

  @media ${theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

/* ─── Individual card ─────────────────────────────────── */
export const Card = styled.article`
  padding: 20px;
  background: ${theme.colors.white};
  border-radius: 20px;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 2px 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const CardIconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

export const IconCircle = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 30px;
    color: ${theme.colors.primary};
  }
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.6;
  opacity: 0.8;
  margin: 0;
`;