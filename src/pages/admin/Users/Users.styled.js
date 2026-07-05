// src/pages/admin/Users/Users.styled.js
import styled from "styled-components";
import { Button, Input } from "antd";
import adminTheme from "../../../styles/adminTheme";

export const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 0 4px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  line-height: 1.3;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${adminTheme.colors.gray};
  margin: 0;
  opacity: 0.8;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 576px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled(Input.Search)`
  width: 260px;

  .ant-input {
    border-radius: 10px 0 0 10px !important;
    font-size: 14px !important;
  }
  .ant-input-affix-wrapper {
    border-radius: 10px 0 0 10px !important;
  }
  .ant-input-group-addon {
    border-radius: 0 10px 10px 0 !important;
    button {
      border-radius: 0 10px 10px 0 !important;
    }
  }

  @media (max-width: 768px) {
    width: 200px;
  }
  @media (max-width: 576px) {
    width: 100%;
  }
`;

export const AddButton = styled(Button)`
  background: ${adminTheme.colors.primary} !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 0 24px !important;
  height: 44px !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;

  &:hover {
    background: ${adminTheme.colors.primaryDark} !important;
  }
  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: 576px) {
    width: 100%;
    justify-content: center;
  }
`;

export const FloatingDeleteButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 50px !important;
  padding: 12px 28px !important;
  height: auto !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  animation: fadeUp 0.25s ease-out;

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  &:hover {
    transform: translateX(-50%) translateY(-2px);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3) !important;
  }

  &.ant-btn-dangerous {
    background: ${adminTheme.colors.danger} !important;
    border-color: ${adminTheme.colors.danger} !important;
    &:hover {
      background: ${adminTheme.colors.dangerDark} !important;
      border-color: ${adminTheme.colors.dangerDark} !important;
    }
  }

  @media (max-width: 640px) {
    bottom: 20px;
    padding: 10px 20px !important;
    font-size: 14px !important;
    min-width: 120px;
    width: calc(100% - 40px);
    justify-content: center;
  }
`;
