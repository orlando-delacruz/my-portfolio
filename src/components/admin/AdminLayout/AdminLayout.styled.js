import styled, { css } from "styled-components";
import adminTheme from "../../../styles/adminTheme";

const SIDEBAR_WIDTH = "280px";
const TOPBAR_HEIGHT = "64px";

// ── Root grid: [sidebar] [main-area] ─────────────────────────────────────────
export const LayoutRoot = styled.div`
  display: grid;
  grid-template-columns: ${SIDEBAR_WIDTH} 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "sidebar main";
  min-height: 100vh;
  background: ${adminTheme.colors.ivory};
  transition: grid-template-columns 0.3s ease;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      grid-template-columns: 0 1fr;
    `}

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-areas: "main";
  }
`;

// ── Sidebar slot — 10px padding wraps the nav pill ───────────────────────────
export const SidebarSlot = styled.aside`
  grid-area: sidebar;
  padding: 10px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 100;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      width: 0;
      padding: 0;
      overflow: hidden;
    `}

  /* Mobile: fixed drawer with slide-in transition */
  @media (max-width: 1024px) {
    /* Reset sticky positioning */
    position: fixed;
    inset: 0;
    width: 280px;
    height: 100vh;
    padding: 10px;
    background: transparent;

    /* Slide from left */
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    /* Always visible but off-screen when closed */
    display: block;

    ${({ $mobileOpen }) =>
      $mobileOpen &&
      css`
        transform: translateX(0);
        z-index: 200;
      `}
  }
`;

// ── Main column: [topbar] [content] [footer] ─────────────────────────────────
export const MainColumn = styled.div`
  grid-area: main;
  display: grid;
  grid-template-rows: ${TOPBAR_HEIGHT} 1fr auto;
  grid-template-areas:
    "topbar"
    "content"
    "footer";
  min-height: 100vh;
  min-width: 0;
`;

export const TopBarSlot = styled.div`
  grid-area: topbar;
  position: sticky;
  top: 0;
  z-index: 90;
`;

export const ContentSlot = styled.main`
  grid-area: content;
  overflow-x: hidden;
  min-width: 0;
`;

export const FooterSlot = styled.div`
  grid-area: footer;
`;

// ── Mobile overlay ────────────────────────────────────────────────────────────
export const Overlay = styled.div`
  /* Hide by default */
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 199;

  @media (min-width: 1025px) {
    /* On desktop the overlay is never used */
    display: none;
  }

  ${({ $visible }) =>
    $visible &&
    css`
      opacity: 1;
      pointer-events: auto;
    `}
`;
