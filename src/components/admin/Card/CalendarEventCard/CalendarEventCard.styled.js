// src\components\admin\Card\CalendarEventCard\CalendarEventCard.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const Card = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${adminTheme.colors.white};
  cursor: pointer;
  text-align: left;
  transition:
    box-shadow 0.15s ease,
    transform 0.1s ease;

  &:hover {
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Time = styled.span`
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  color: ${adminTheme.colors.black};
`;

export const PatientName = styled.span`
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  color: ${adminTheme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const StatusRow = styled.div`
  display: flex;
  align-self: stretch;
  justify-content: flex-end;
  margin-top: 2px;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 5px;
  padding: 1px 4px;
  font-family: Inter, sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;
  color: ${({ $color }) => $color ?? adminTheme.colors.black};
  background: ${({ $bg }) => $bg ?? "transparent"};
  border: 1px solid ${({ $color }) => $color ?? "transparent"};
`;
