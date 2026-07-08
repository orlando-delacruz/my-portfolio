// src/pages/admin/Appointment/sections/Filter/Filter.styled.js
import styled, { css } from "styled-components";
import { IoChevronDown } from "react-icons/io5";
import adminTheme from "../../../../../styles/adminTheme";

export const FilterCardWrapper = styled.div`


  .ant-collapse {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
  }

  .ant-collapse-item {
    border: none !important;
  }

  .ant-collapse-header {
    padding: 16px 24px !important;
    align-items: center !important;

    @media (max-width: 768px) {
      padding: 14px 16px !important;
    }
  }

  .ant-collapse-content {
    border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
  }

  .ant-collapse-content-box {
    padding: 0 24px 20px !important;

    @media (max-width: 768px) {
      padding: 0 16px 16px !important;
    }
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 16px;
  cursor: pointer;

  @media (max-width: 576px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const CardTitle = styled.h3`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.4;
`;

export const CardSubtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: ${adminTheme.colors.gray};
  margin: 0;
  line-height: 1.5;
  opacity: 0.7;

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: ${adminTheme.colors.primary};
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  line-height: 1;
`;

export const ToggleText = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: ${adminTheme.colors.primary};
  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 13px;
  }
`;

export const ChevronIcon = styled(IoChevronDown)`
  font-size: 18px;
  color: ${adminTheme.colors.primary};
  transition: transform 0.25s ease;

  ${({ $expanded }) =>
    $expanded &&
    css`
      transform: rotate(180deg);
    `}
`;

export const FilterBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-end;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchWrapper = styled.div`
  flex: 2 1 30%;
  min-width: 200px;

  @media (max-width: 768px) {
    flex: 1 1 auto;
    min-width: 0;
  }
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  flex: 3 1 70%;

  & > * {
    flex: 1 1 0;
    min-width: 120px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    & > * {
      min-width: 0;
    }
  }

  @media (min-width: 769px) and (max-width: 1199px) {
    /* Tablet: two rows: first row has Search and one control? Actually we want Search on its own row? 
       The current flex-wrap will naturally wrap – Search is 30%, others 70% – they may wrap if space insufficient.
       We'll rely on flex-wrap: wrap to handle it gracefully.
    */
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 4px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

export const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  color: ${adminTheme.colors.black};
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;

  svg {
    font-size: 16px;
    color: ${adminTheme.colors.primary};
  }

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    opacity: 0.8;
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 8px 16px;
  }
`;