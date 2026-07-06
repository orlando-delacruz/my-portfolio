// src/pages/admin/Settings/sections/ServiceManagement/ServiceManagement.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

export const ServiceListWrapper = styled.div`
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
  scrollbar-width: thin;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: ${adminTheme.colors.champagne}; border-radius: 4px; }
`;

export const DetailsWrapper = styled.div`
  padding: 0 4px;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${adminTheme.colors.primary};
  font-size: 14px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { text-decoration: underline; }
`;

export const ServiceCard = styled.div`
  padding: 12px 16px;
  border: 1px solid ${({ $selected }) => ($selected ? adminTheme.colors.primary : "rgba(0,0,0,0.08)")};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $selected }) => ($selected ? "rgba(136,98,23,0.06)" : "white")};
  &:hover {
    border-color: ${adminTheme.colors.primary};
    background: rgba(136,98,23,0.04);
  }
`;

export const ServiceCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ServiceName = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: ${adminTheme.colors.black};
`;

export const ServiceCardMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 14px; /* ✅ was 12px */
  color: ${adminTheme.colors.gray};
`;

export const DetailsPanel = styled.div`
  padding: 4px 0;
`;

export const DetailsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const DetailsTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
`;

export const DetailsActions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 8px;
`;

export const EmptyDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
`;