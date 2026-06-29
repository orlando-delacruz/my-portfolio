import styled, { css } from "styled-components";
import adminTheme from "../../../styles/adminTheme";

export const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 20px;
  background: #ffffff;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  /* Horizontal scroll on mobile, no visible scrollbar */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    padding: 10px 12px;
    gap: 12px;
    /* Prevent items from wrapping — let it scroll instead */
    flex-wrap: nowrap;
  }
`;

export const EntriesInfo = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  color: #222222;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const PageControls = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  flex-shrink: 0;
`;

export const NavBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
  color: #222222;

  &:hover:not(:disabled) {
    background: ${adminTheme.colors.ivory};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const PageBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  ${({ $active }) =>
    $active
      ? css`
          background: ${adminTheme.colors.champagne};
          color: #ffffff;
          border-color: rgba(0, 0, 0, 0.25);
        `
      : css`
          background: #ffffff;
          color: #222222;
        `}

  ${({ $ellipsis }) =>
    $ellipsis &&
    css`
      cursor: default;
      border: none;
      background: transparent;
    `}

  &:hover:not(:disabled) {
    background: ${({ $active, $ellipsis }) =>
      $active || $ellipsis ? undefined : adminTheme.colors.ivory};
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const SizeSelectWrapper = styled.div`
  flex-shrink: 0;

  .ant-select-selector {
    border-radius: 5px !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    font-family: "Inter", sans-serif !important;
    font-size: 10px !important;
    box-shadow: none !important;
  }

  .ant-select-selection-item {
    font-size: 10px !important;
    line-height: 15px !important;
    color: #222222 !important;
  }
`;
