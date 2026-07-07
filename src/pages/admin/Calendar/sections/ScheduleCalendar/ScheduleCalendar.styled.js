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
  gap: 10px;
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

  ${({ $isClosed }) =>
    $isClosed &&
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

  ${({ $isClosed }) =>
    $isClosed &&
    css`
      background: #dc2626;
      color: #fff;
      border-radius: 50%;
      padding: 2px 8px;
      min-width: 28px;
      text-align: center;
      display: inline-block;
      font-size: 12px;
    `}

  transition: all 0.15s ease;
`;

export const ClosedLabel = styled.div`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 4px;
  padding: 4px 8px;
  display: inline-block;
  align-self: center;
  border: 1px solid rgba(220, 38, 38, 0.2);
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