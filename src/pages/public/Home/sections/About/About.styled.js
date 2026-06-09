// src/pages/public/Home/sections/About/About.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../../styles/theme";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Section ─────────────────────────────────────────── */
export const AboutSection = styled.section`
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

/* ─── Header block ────────────────────────────────────── */
export const SectionHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
  animation: ${fadeUp} 0.55s ease both;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  padding-bottom: 5px;
  border-bottom: 2px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  width: fit-content;
`;

export const Heading = styled.h2`
  font-size: ${theme.typography.heading.h2};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  color: ${theme.colors.black};
  margin: 0;

  span.accent {
    color: ${theme.colors.primary};
  }
`;

/* ─── Body layout — text + image ─────────────────────── */
export const AboutBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
  animation: ${fadeUp} 0.65s 0.1s ease both;

  @media ${theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

/* ─── Left — copy + highlights ───────────────────────── */
export const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 10px 0;
`;

export const BodyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  p {
    font-size: ${theme.typography.size.body};
    color: ${theme.colors.black};
    line-height: 1.7;
    margin: 0;
    opacity: 0.85;
  }
`;

export const HighlightList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const HighlightItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    font-size: 20px;
    color: ${theme.colors.primary};
  }
`;

/* ─── Right — image ───────────────────────────────────── */
export const AboutImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 20px;
  object-fit: cover;
  aspect-ratio: 16 / 9;
  display: block;
  padding: 10px;

  @media ${theme.media.tablet} {
    order: -1;
  }
`;