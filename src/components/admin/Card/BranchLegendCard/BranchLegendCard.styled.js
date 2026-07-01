// src\components\admin\Card\BranchLegendCard\BranchLegendCard.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px;
  flex-wrap: wrap;
  row-gap: 6px;
`;

export const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: inline-block;
  flex-shrink: 0;
`;

export const StatusLabel = styled.span`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ $color }) => $color};
`;

export const BranchItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border-left: 1px solid rgba(0, 0, 0, 0.25);

  &:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.25);
  }
`;

export const BranchBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: ${adminTheme.colors.white};
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  flex-shrink: 0;
`;

export const BranchLabel = styled.span`
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${adminTheme.colors.black};
  white-space: nowrap;
`;
