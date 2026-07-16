// src/components/layout/CallToAction/CallToAction.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../styles/theme";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Outer section wrapper ───────────────────────────── */
export const CTASection = styled.section`
  background: ${theme.colors.background};
  overflow: hidden;
`;

/* ─── Gradient card — 2-col grid on desktop ───────────── */
export const CTACard = styled.div`
  border-radius: 30px;
  background: ${({ $backgroundImage }) =>
    $backgroundImage
      ? `linear-gradient(90deg, ${theme.colors.white} 41%, rgba(136, 98, 23, 0.5) 100%), url(${$backgroundImage})`
      : `linear-gradient(90deg, ${theme.colors.white} 41%, rgba(136, 98, 23, 0.5) 100%)`};
  background-size: cover;
  background-position: center;
  padding: 40px;
  overflow: hidden;
  animation: ${fadeUp} 0.6s ease both;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;

  @media ${theme.media.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    padding: 32px 24px;
    background: ${({ $backgroundImage }) =>
      $backgroundImage
        ? `linear-gradient(135deg, ${theme.colors.white} 50%, rgba(136, 98, 23, 0.35) 100%), url(${$backgroundImage})`
        : `linear-gradient(135deg, ${theme.colors.white} 50%, rgba(136, 98, 23, 0.35) 100%)`};
    background-size: cover;
    background-position: center;
  }

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
    padding: 28px 20px;
    border-radius: 20px;
    background: ${({ $backgroundImage }) =>
      $backgroundImage
        ? `linear-gradient(180deg, ${theme.colors.white} 60%, rgba(136, 98, 23, 0.35) 100%), url(${$backgroundImage})`
        : `linear-gradient(180deg, ${theme.colors.white} 60%, rgba(136, 98, 23, 0.35) 100%)`};
    background-size: cover;
    background-position: center;
  }
`;

/* ─── Left col — text + buttons ──────────────────────── */
export const CTAContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  text-align: left;

  @media ${theme.media.mobile} {
    align-items: center;
    text-align: center;
    order: 2;
  }
`;

export const CTAHeading = styled.h2`
  font-size: ${theme.typography.heading.h2};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
  line-height: 1.5;
  margin: 0;

  @media ${theme.media.mobile} {
    font-size: clamp(1.5rem, 5vw, 2rem);
  }
`;

export const CTADescription = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
`;

/* ─── CTA buttons row ─────────────────────────────────── */
export const CTAButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media ${theme.media.mobile} {
    flex-direction: column;
    width: 100%;
    gap: 14px;
    justify-content: center;
  }
`;

/* ─── Right col — image ───────────────────────────────── */
export const CTAImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 280px;
  max-height: 380px;
  object-fit: cover;
  border-radius: 20px;
  display: block;

  @media ${theme.media.mobile} {
    order: 1;
    min-height: 200px;
    max-height: 220px;
  }
`;
