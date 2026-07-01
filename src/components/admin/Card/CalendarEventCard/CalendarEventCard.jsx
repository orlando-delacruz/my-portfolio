// src\components\admin\Card\CalendarEventCard\CalendarEventCard.jsx
import { memo } from "react";
import { STATUS_MAP } from "../../../../constants/calendarConstants";
import * as S from "./CalendarEventCard.styled";

/**
 * Compact appointment card rendered inside a calendar day cell.
 *
 * @param {string} time
 * @param {string} patientName
 * @param {string} status — one of APPOINTMENT_STATUSES values
 * @param {function} [onClick]
 */
const CalendarEventCard = ({ time, patientName, status, onClick }) => {
  const statusInfo = STATUS_MAP[status];

  return (
    <S.Card
      type="button"
      onClick={onClick}
      aria-label={`${patientName}, ${time}, status ${statusInfo?.label ?? status}`}
    >
      <S.Time>{time}</S.Time>
      <S.PatientName>{patientName}</S.PatientName>
      <S.StatusRow>
        <S.StatusBadge $color={statusInfo?.color} $bg={statusInfo?.bg}>
          {statusInfo?.label ?? status}
        </S.StatusBadge>
      </S.StatusRow>
    </S.Card>
  );
};

export default memo(CalendarEventCard);