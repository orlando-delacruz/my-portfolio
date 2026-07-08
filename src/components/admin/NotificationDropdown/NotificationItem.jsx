// src/components/admin/NotificationDropdown/NotificationItem.jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import * as S from './NotificationItem.styled';

dayjs.extend(relativeTime);

const iconMap = {
  NEW_BOOKING: '🆕',
  UPCOMING_DAY: '📅',
  UPCOMING_HOUR: '⏰',
};

const NotificationItem = memo(({ notification, onMarkRead, onDelete }) => {
  const navigate = useNavigate();
  const { id, type, title, message, appointment_id, is_read, created_at } = notification;

  const handleClick = () => {
    if (!is_read) {
      onMarkRead(id);
    }
    if (appointment_id) {
      navigate(`/admin/appointments?highlight=${appointment_id}`);
    } else {
      navigate('/admin/appointments');
    }
  };

  return (
    <S.Item $isRead={is_read} onClick={handleClick}>
      <S.IconWrapper>{iconMap[type] || '📌'}</S.IconWrapper>
      <S.Content>
        <S.Title>{title}</S.Title>
        <S.Message>{message}</S.Message>
        <S.Time>{dayjs(created_at).fromNow()}</S.Time>
      </S.Content>
      <S.Actions onClick={(e) => e.stopPropagation()}>
        {!is_read && (
          <S.ActionButton onClick={() => onMarkRead(id)} title="Mark as read">
            <FiCheck />
          </S.ActionButton>
        )}
        <S.ActionButton onClick={() => onDelete(id)} title="Delete" $danger>
          <FiX />
        </S.ActionButton>
      </S.Actions>
    </S.Item>
  );
});

NotificationItem.displayName = 'NotificationItem';
export default NotificationItem;