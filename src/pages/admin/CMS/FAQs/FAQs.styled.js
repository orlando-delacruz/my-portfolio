// src/pages/admin/CMS/FAQs/FAQs.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const Container = styled.div`
  padding: 24px;
  max-width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 24px;
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${adminTheme.colors.black};
  margin: 0;
  opacity: 0.7;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const Card = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow:
    0 1px 2px rgba(17, 17, 17, 0.04),
    0 2px 8px rgba(17, 17, 17, 0.05);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 16px 0 12px 0;

  &:first-of-type {
    margin-top: 0;
  }
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  border: 1px solid ${adminTheme.colors.champagne};
  border-radius: 8px;
  padding: 8px;
  min-height: 60px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: ${adminTheme.colors.gray};
  font-size: 14px;
`;

export const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: ${adminTheme.colors.ivory};
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: background 0.15s;

  &:hover {
    background: ${adminTheme.colors.champagne}40;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const ItemName = styled.span`
  font-weight: 500;
  color: ${adminTheme.colors.black};
  font-size: 14px;
  word-break: break-word;
`;

export const ItemMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${adminTheme.colors.gray};
  flex-wrap: wrap;

  span {
    white-space: nowrap;
  }
`;

export const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-end;
  }

  .ant-btn {
    border-radius: 6px;
    font-size: 12px;
    padding: 4px 8px;
    height: auto;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $active }) =>
    $active ? "rgba(17, 216, 150, 0.15)" : "rgba(248, 19, 19, 0.15)"};
  color: ${({ $active }) => ($active ? "#11D896" : "#F81313")};
  border: 1px solid ${({ $active }) => ($active ? "#11D896" : "#F81313")}40;
  white-space: nowrap;
`;

export const AddButtonWrapper = styled.div`
  margin-top: 4px;
`;
