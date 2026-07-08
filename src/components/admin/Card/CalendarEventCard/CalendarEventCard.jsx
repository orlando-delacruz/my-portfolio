// src/components/admin/Card/CalendarEventCard/CalendarEventCard.jsx
import { memo } from 'react';
import { STATUS_MAP } from '../../../../constants/calendarConstants';
import * as S from './CalendarEventCard.styled';

const CalendarEventCard = memo(({
  time,
  patientName,
  status,
  onClick,
  branchInitial,
  branchColor,
  isWalkIn = false,
}) => {
  const statusInfo = STATUS_MAP[status];

  return (
    <S.Card
      type="button"
      onClick={onClick}
      aria-label={`${patientName}, ${time}, status ${statusInfo?.label ?? status}`}
    >
      <S.Row>
        <S.BranchBadge $color={branchColor} aria-label={`Branch ${branchInitial}`}>
          {branchInitial || '•'}
        </S.BranchBadge>
        <S.Time>{time}</S.Time>
      </S.Row>
      <S.PatientName>{patientName}</S.PatientName>
      <S.StatusRow>
        {isWalkIn && <S.WalkInBadge>Walk-in</S.WalkInBadge>}
        <S.StatusBadge $color={statusInfo?.color} $bg={statusInfo?.bg}>
          {statusInfo?.label ?? status}
        </S.StatusBadge>
      </S.StatusRow>
    </S.Card>
  );
});

CalendarEventCard.displayName = 'CalendarEventCard';
export default CalendarEventCard;