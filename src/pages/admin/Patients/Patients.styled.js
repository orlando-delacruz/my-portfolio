// src/pages/admin/Patients/Patients.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";
import { Button } from "antd";

export const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
`;

export const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  background: ${adminTheme.colors.white};
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.08);

  .ant-input-search,
  .ant-select {
    flex: 1 1 200px;
    min-width: 180px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;

    .ant-input-search,
    .ant-select {
      flex: 1 1 auto;
    }
  }
`;

export const TableWrapper = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);

  .ant-table {
    font-family: inherit !important;
  }

  .ant-table-thead > tr > th {
    background: ${adminTheme.colors.champagne} !important;
    color: ${adminTheme.colors.black} !important;
    font-weight: 600 !important;
    font-size: 13px !important;
    border-bottom: 1px solid ${adminTheme.colors.champagne} !important;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0 !important;
    font-size: 14px !important;
    color: ${adminTheme.colors.black} !important;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(136, 98, 23, 0.04) !important;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none !important;
  }

  .ant-table-empty .ant-table-tbody > tr > td {
    padding: 40px !important;
  }

  .ant-pagination {
    margin: 16px 20px !important;
  }

  .ant-pagination-item-active {
    border-color: ${adminTheme.colors.primary} !important;
    a {
      color: ${adminTheme.colors.primary} !important;
    }
  }

  .ant-pagination-item:not(.ant-pagination-item-active):hover {
    border-color: ${adminTheme.colors.primary} !important;
    a {
      color: ${adminTheme.colors.primary} !important;
    }
  }

  .ant-pagination-options-quick-jumper input:focus {
    border-color: ${adminTheme.colors.primary} !important;
    box-shadow: 0 0 0 2px rgba(136, 98, 23, 0.2) !important;
  }
`;

export const OrthoBadge = styled.span`
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $isOrtho }) =>
    $isOrtho ? "rgba(136, 98, 23, 0.15)" : "rgba(0, 0, 0, 0.05)"};
  color: ${({ $isOrtho }) => ($isOrtho ? adminTheme.colors.primary : "#888")};
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${adminTheme.colors.primary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;

  &:hover {
    background: rgba(136, 98, 23, 0.08);
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const FloatingDeleteButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 50px;
  padding: 12px 28px;
  height: auto;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 8px;
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
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 640px) {
    bottom: 20px;
    padding: 10px 20px;
    font-size: 14px;
    width: auto;
    min-width: 120px;
    justify-content: center;
  }
`;
