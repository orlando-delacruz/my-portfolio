// src/components/admin/NotificationDropdown/NotificationDropdown.jsx
import { memo, useRef, useEffect } from 'react';
import { Spin } from 'antd';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../../hooks/useNotifications';
import { useNotificationStore } from '../../../store/notificationStore';
import NotificationItem from './NotificationItem';
import * as S from './NotificationDropdown.styled';

const NotificationDropdown = memo(() => {
  const { isDropdownOpen, toggleDropdown, closeDropdown } = useNotificationStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, closeDropdown]);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <S.Wrapper ref={dropdownRef}>
      <S.BellButton onClick={toggleDropdown} aria-label="Notifications">
        <FiBell size={22} />
        {unreadCount > 0 && <S.Badge>{unreadCount > 99 ? '99+' : unreadCount}</S.Badge>}
      </S.BellButton>

      {isDropdownOpen && (
        <S.Dropdown>
          <S.Header>
            <S.HeaderTitle>Notifications</S.HeaderTitle>
            {unreadCount > 0 && (
              <S.MarkAllButton onClick={handleMarkAllRead}>
                Mark all as read
              </S.MarkAllButton>
            )}
          </S.Header>

          <S.List>
            {isLoading ? (
              <S.EmptyState>
                <Spin size="small" />
              </S.EmptyState>
            ) : notifications.length === 0 ? (
              <S.EmptyState>No notifications</S.EmptyState>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            )}
          </S.List>
        </S.Dropdown>
      )}
    </S.Wrapper>
  );
});

NotificationDropdown.displayName = 'NotificationDropdown';
export default NotificationDropdown;