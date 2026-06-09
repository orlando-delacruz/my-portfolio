// src/pages/public/Home/sections/Hero/Hero.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../../styles/theme";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
`;

/* ─── Section wrapper ─────────────────────────────────── */
export const HeroSection = styled.section`
  background: ${theme.colors.background};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  overflow: hidden;

  @media ${theme.media.tablet} {
    grid-template-columns: 1fr;
    padding: 50px 30px 40px;
    min-height: unset;
  }

  @media ${theme.media.mobile} {
    padding: 40px 20px 40px;
    gap: 32px;
  }
`;

/* ─── Left column ─────────────────────────────────────── */
export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: ${fadeUp} 0.6s ease both;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 50px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.typography.size.xs};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  width: fit-content;
`;

export const HeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Heading = styled.h1`
  font-size: ${theme.typography.heading.h1};
  font-weight: ${theme.typography.weight.semibold};
  line-height: 1.15;
  color: ${theme.colors.black};
  margin: 0;

  span.accent {
    color: ${theme.colors.primary};
  }
`;

export const Description = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  max-width: 520px;
  opacity: 0.85;
`;

/* ─── CTA row ─────────────────────────────────────────── */
export const CtaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;

  @media ${theme.media.mobile} {
    justify-content: center;
  }
`;

/* ─── Right column — image stage ─────────────────────── */
export const HeroImageStage = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeUp} 0.7s 0.15s ease both;

  @media ${theme.media.tablet} {
    order: -1;
  }
`;

export const ImageGlow = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: radial-gradient(
    ellipse 60% 60% at 50% 50%,
    ${theme.colors.primary}33 0%,
    transparent 70%
  );
  z-index: 0;
  pointer-events: none;
`;

export const HeroImage = styled.img`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 580px;
  height: auto;
  border-radius: 20px;
  object-fit: contain;
  aspect-ratio: 4 / 3;
  display: block;
`;

/* ─── Floating stat badges ─────────────────────────────── */
export const StatBadge = styled.div`
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${theme.colors.white};
  border-radius: 14px;
  border: 1px solid ${theme.colors.primary};
  box-shadow: 1px 2px 12px rgba(0, 0, 0, 0.12);
  font-size: ${theme.typography.size.xs};
  color: ${theme.colors.black};
  font-weight: ${theme.typography.weight.medium};
  white-space: nowrap;
  animation: ${floatY} 4s ease-in-out infinite;

  svg {
    color: ${theme.colors.primary};
    font-size: 16px;
    flex-shrink: 0;
  }

  &:nth-child(1) { animation-delay: 0s; }
  &:nth-child(2) { animation-delay: 1.3s; }
  &:nth-child(3) { animation-delay: 2.6s; }

  /* Positions */
  &.stat--experience {
    top: 18%;
    right: -6%;

    @media ${theme.media.tablet} {
      right: 2%;
    }

    @media ${theme.media.mobile} {
      right: -10px;
      padding: 5px 10px;
      font-size: 10px;
      border-radius: 10px;
    }
  }

  &.stat--rating {
    bottom: 20%;
    right: -6%;

    @media ${theme.media.tablet} {
      right: 2%;
    }

    @media ${theme.media.mobile} {
      right: -10px;
      padding: 5px 10px;
      font-size: 10px;
      border-radius: 10px;
    }
  }

  &.stat--patients {
    top: 30%;
    left: -4%;

    @media ${theme.media.tablet} {
      left: 2%;
    }

    @media ${theme.media.mobile} {
      left: -10px;
      top: 50%;
      padding: 5px 10px;
      font-size: 10px;
      border-radius: 10px;
    }
  }
`;