// src/pages/admin/Calendar/sections/ScheduleCalendar/ScheduleCalendar.styled.js
import styled, { css } from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: ${adminTheme.colors.white};
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: 900px) {
    padding: 10px;
    overflow-x: auto;
  }
`;

export const WeekdayHeader = styled.div`
  padding: 10px 14px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  color: ${adminTheme.colors.black};
`;

export const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 110px;
  padding: 10px 15px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: ${adminTheme.colors.white};

  ${({ $isCurrentMonth }) =>
    !$isCurrentMonth &&
    css`
      background: ${adminTheme.colors.ivory};
    `}

  ${({ $isToday }) =>
    $isToday &&
    css`
      outline: 2px solid ${adminTheme.colors.primary};
      outline-offset: -2px;
    `}

  ${({ $hasClosure }) =>
    $hasClosure &&
    css`
      background: #fef2f2;
      border-color: #fecaca;
    `}
`;

export const DayHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  width: 100%;

  ${({ $hasClosure }) =>
    $hasClosure &&
    css`
      justify-content: center;
    `}
`;

export const DayNumber = styled.span`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ $isCurrentMonth }) =>
    $isCurrentMonth ? adminTheme.colors.black : "rgba(0,0,0,0.5)"};

  ${({ $isToday }) =>
    $isToday &&
    css`
      color: ${adminTheme.colors.primary};
    `}

  ${({ $hasClosure }) =>
    $hasClosure &&
    css`
      background: #dc2626;
      color: #fff;
      border-radius: 50%;
      padding: 0 8px;
      min-width: 28px;
      text-align: center;
      display: inline-block;
      font-weight: 700;
    `}

  transition: all 0.15s ease;
`;

export const IndicatorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin: 2px 0;
`;

export const IndicatorBadge = styled.span`
  font-size: 9px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;

  ${({ $type }) => {
    switch ($type) {
      case 'day-off':
        return css`
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'sabbath':
        return css`
          background: #ede9fe;
          color: #6d28d9;
        `;
      case 'closure':
        return css`
          background: #fee2e2;
          color: #991b1b;
        `;
      default:
        return css`
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

export const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MoreButton = styled.button`
  align-self: flex-start;
  border: none;
  background: none;
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: ${adminTheme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;