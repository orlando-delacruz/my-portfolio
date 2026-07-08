// src/pages/admin/Settings/SettingsSkeleton.styled.js
import styled from "styled-components";
import { Skeleton } from "antd";
import adminTheme from "../../../styles/adminTheme";

export const Card = styled.div`
  width: 100%;
  padding: 10px;
  background: ${adminTheme.colors.white};
  overflow: hidden;
  border-radius: 10px;
  outline: 1px solid rgba(136, 98, 23, 0.20);
  outline-offset: -1px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const TitleSkeleton = styled(Skeleton.Input)`
  width: 120px !important;
  height: 16px !important;

  .ant-skeleton-input {
    width: 120px !important;
    height: 16px !important;
  }
`;

export const SubtitleSkeleton = styled(Skeleton.Input)`
  width: 180px !important;
  height: 12px !important;

  .ant-skeleton-input {
    width: 180px !important;
    height: 12px !important;
  }
`;

export const Body = styled.div`
  width: 100%;
  padding: 0 10px 10px;
`;