// src/pages/public/Home/sections/Gallery/Gallery.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../../styles/theme";

/* ─── Scroll animations ───────────────────────────────── */
const scrollDown = keyframes`
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
`;

// Column scrolls upward
const scrollUp = keyframes`
  0%   { transform: translateY(-50%); }
  100% { transform: translateY(0); }
`;

/* ─── Section ─────────────────────────────────────────── */
export const GallerySection = styled.section`
  background: ${theme.colors.background};
  display: flex;
  gap: 35px;
  overflow: hidden;

  @media ${theme.media.tablet} {
    flex-direction: column;
  }
`;

/* ─── Top row: header + description + highlights ─────── */
export const GalleryHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Description = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  opacity: 0.85;
  max-width: 680px;
  margin: 0;
`;

export const HighlightList = styled.ul`
  list-style: none;
  padding: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* ─── Two-column masonry strip ────────────────────────── */
export const GalleryColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  height: 845px;
  overflow: hidden;
  /* Fade edges top & bottom for a seamless feel */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );

  @media ${theme.media.tablet} {
    height: 600px;
  }

  @media ${theme.media.mobile} {
    height: 420px;
  }
`;

/* ─── A single scrolling column ──────────────────────── */
export const ScrollTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* Will-change tells the browser to promote to its own layer */
  will-change: transform;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  /* Pause on hover for UX */
  &:hover {
    animation-play-state: paused;
  }

  &.scroll-down {
    animation-name: ${scrollDown};
    animation-duration: 28s;
  }

  &.scroll-up {
    animation-name: ${scrollUp};
    animation-duration: 24s;
  }
`;

/* ─── Individual gallery image ────────────────────────── */
export const GalleryImage = styled.img`
  width: 100%;
  border-radius: 35px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;

  @media ${theme.media.mobile} {
    border-radius: 20px;
  }
`;