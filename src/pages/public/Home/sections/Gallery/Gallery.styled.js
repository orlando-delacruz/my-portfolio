// src/pages/public/Home/sections/Gallery/Gallery.styled.js
import styled, { keyframes } from "styled-components";
import theme from "../../../../../styles/theme";

export const GallerySection = styled.section`
  background: ${theme.colors.background};
  display: flex;
  gap: 35px;
  overflow: hidden;

  @media ${theme.media.tablet} {
    flex-direction: column;
  }
`;

export const GalleryHeader = styled.div`
  flex: 0 0 45%;
  max-width: 45%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media ${theme.media.tablet} {
    flex: 1 1 auto;
    max-width: 100%;
  }
`;

export const Description = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  opacity: 0.85;
  margin: 0;
`;

export const HighlightList = styled.ul`
  list-style: none;
  padding: 0;
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

export const GalleryColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex: 1;
  height: 80vh;
  min-height: 480px;
  max-height: 900px;

  @media ${theme.media.tablet} {
    height: 55vh;
    min-height: 320px;
    max-height: 600px;
    width: 100%;
  }

  @media ${theme.media.mobile} {
    height: 45vh;
    min-height: 240px;
    max-height: 420px;
  }
`;

export const ScrollViewport = styled.div`
  overflow: hidden;
  height: 100%;
  border-radius: 35px;
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
`;

// Track renders the padded image list THREE times back-to-back (see
// Gallery.jsx). Because all three copies are identical, animating exactly
// 0 -> -33.3333% (or the reverse) loops with zero seam — the third copy
// is buffer so the mask fade never exposes the wrap point.
const scrollUp = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-33.3333%);
  }
`;

const scrollDown = keyframes`
  from {
    transform: translateY(-33.3333%);
  }
  to {
    transform: translateY(0);
  }
`;

export const ScrollTrack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  will-change: transform;
  backface-visibility: hidden;
  animation-name: ${({ $direction }) =>
    $direction === "up" ? scrollUp : scrollDown};
  animation-duration: ${({ $duration }) => $duration || 30}s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;

  /* Hovering any image inside still counts as hovering this element,
     since :hover applies to the element and all its descendants. */
  &:hover {
    animation-play-state: paused;
  }
`;

export const GalleryImage = styled.img`
  width: 100%;
  height: 220px;
  border-radius: 35px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
  margin-bottom: 10px;
  box-sizing: border-box;

  @media ${theme.media.tablet} {
    height: 180px;
    margin-bottom: 8px;
  }

  @media ${theme.media.mobile} {
    height: 140px;
    border-radius: 20px;
    margin-bottom: 6px;
  }
`;

export const EmptyColumn = styled.div`
  height: 100%;
  border-radius: 35px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 14px;
`;
