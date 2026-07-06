// src/pages/admin/Settings/sections/BranchManagement/BranchManagement.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BranchList = styled.div`
  width: 100%;
  border-radius: 5px;
  outline: 1px solid rgba(136, 98, 23, 0.20);
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const BranchItem = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(136, 98, 23, 0.20);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

export const BranchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const BranchName = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  word-wrap: break-word;
`;

export const BranchAddress = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 10px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  word-wrap: break-word;
  opacity: 0.7;
`;

export const BranchActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const AddButtonWrapper = styled.div`
  width: 100%;
  border-radius: 5px;
  outline: 1px solid rgba(136, 98, 23, 0.20);
  outline-offset: -1px;
  overflow: hidden;
`;