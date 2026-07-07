// src/components/admin/NotificationDropdown/NotificationDropdown.styled.js
import styled from 'styled-components';
import adminTheme from '../../../styles/adminTheme';

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const BellButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  position: relative;
  color: ${adminTheme.colors.black};
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  line-height: 1;
  border: 2px solid ${adminTheme.colors.ivory};
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 420px;
  max-height: 480px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1000;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    max-height: 400px;
    right: auto;
    left: -130%;
    transform: translateX(-50%);
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid #f0f0f0;
`;

export const HeaderTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
`;

export const MarkAllButton = styled.button`
  background: none;
  border: none;
  color: ${adminTheme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.7;
  }
`;

export const List = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${adminTheme.colors.champagne};
    border-radius: 4px;
  }
`;

export const EmptyState = styled.div`
  padding: 32px 20px;
  text-align: center;
  color: ${adminTheme.colors.gray};
  font-size: 14px;
`;