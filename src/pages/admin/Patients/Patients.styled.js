// src/pages/admin/Patients/Patients.styled.js
import styled from "styled-components";
import adminTheme from "../../../styles/adminTheme";

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

export const Filters = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.08);
`;

export const SearchInput = styled.input`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${adminTheme.colors.champagne};
  font-size: 14px;
  min-width: 200px;
  outline: none;

  &:focus {
    border-color: ${adminTheme.colors.primary};
  }
`;

export const FilterSelect = styled.select`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid ${adminTheme.colors.champagne};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${adminTheme.colors.primary};
  }
`;

export const TableWrapper = styled.div`
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

export const Thead = styled.thead`
  background: ${adminTheme.colors.champagne};
`;

export const Th = styled.th`
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: ${adminTheme.colors.black};
  border-bottom: 1px solid ${adminTheme.colors.champagne};
`;

export const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${adminTheme.colors.black};
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
`;

export const OrthoBadge = styled.span`
  display: inline-block;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $isOrtho }) =>
    $isOrtho ? "rgba(136, 98, 23, 0.15)" : "rgba(0,0,0,0.05)"};
  color: ${({ $isOrtho }) => ($isOrtho ? adminTheme.colors.primary : "#888")};
`;

export const EditButton = styled.button`
  padding: 4px 14px;
  border-radius: 6px;
  border: 1px solid ${adminTheme.colors.primary};
  background: transparent;
  color: ${adminTheme.colors.primary};
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;

  &:hover {
    background: ${adminTheme.colors.primary};
    color: #fff;
  }
`;

export const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 14px;
  }
`;

export const PaginationWrapper = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
`;
