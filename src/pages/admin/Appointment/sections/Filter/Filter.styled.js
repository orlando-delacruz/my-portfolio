// src/pages/admin/Appointment/sections/Filter/Filter.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const FilterCard = styled.aside`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 12px;
    animation: slideDown 0.25s ease-out;

    & > * {
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
    & > *:last-child {
      border-bottom: none;
    }
  }

  & > * {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }
  & > *:last-child {
    border-right: none;
  }

  @media (max-width: 992px) and (min-width: 769px) {
    & > *:nth-child(2n) {
      border-right: none;
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ResetRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding: 8px 20px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;

  @media (max-width: 768px) {
    padding: 10px 16px;
    justify-content: center;
    border-top: none;
    background: transparent;
  }
`;

export const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: transparent;
  color: ${adminTheme.colors.black};
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s,
    opacity 0.2s;

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
    padding: 10px 16px;
    font-size: 14px;
  }
`;
