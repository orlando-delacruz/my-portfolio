// src/components/admin/NotificationDropdown/NotificationItem.styled.js
import styled, { css } from 'styled-components';
import adminTheme from '../../../styles/adminTheme';

export const Item = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.15s;

  ${({ $isRead }) =>
    !$isRead &&
    css`
      background: rgba(136, 98, 23, 0.06);
    `}

  &:hover {
    background: rgba(136, 98, 23, 0.08);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const IconWrapper = styled.span`
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin-bottom: 2px;
`;

export const Message = styled.div`
  font-size: 13px;
  color: ${adminTheme.colors.gray};
  line-height: 1.4;
  word-break: break-word;
`;

export const Time = styled.div`
  font-size: 11px;
  color: ${adminTheme.colors.gray};
  margin-top: 4px;
  opacity: 0.7;
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: ${({ $danger }) => ($danger ? '#dc2626' : '#888')};
  transition: background 0.15s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;