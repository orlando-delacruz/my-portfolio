// src\pages\admin\Calendar\sections\ScheduleCalendar\ScheduleCalendar.jsx
import { memo, useMemo, useState, useCallback } from "react";
import { Alert, Skeleton } from "antd";
import CalendarEventCard from "../../../../../components/admin/Card/CalendarEventCard";
import useCalendarStore from "../../../../../store/useCalendarStore";
import useCalendarAppointments from "../../../../../hooks/useCalendarAppointments";
import { buildCalendarGrid } from "../../../../../utils/calendarGrid";
import {
  WEEKDAY_LABELS,
  MAX_VISIBLE_EVENTS_PER_DAY,
} from "../../../../../constants/calendarConstants";
import * as S from "./ScheduleCalendar.styled";

/**
 * Renders the month grid. Reads month/branch from useCalendarStore so it
 * stays in sync with the Toolbar and Filters without prop drilling.
 */
const ScheduleCalendar = () => {
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const branchId = useCalendarStore((s) => s.branchId);

  const { appointmentsByDate, loading, error } = useCalendarAppointments(branchId);

  // Memoized — only recompute the 6x7 grid when the visible month changes.
  const gridDays = useMemo(() => buildCalendarGrid(currentMonth), [currentMonth]);

  const [expandedDates, setExpandedDates] = useState(() => new Set());

  const toggleExpanded = useCallback((isoDate) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      next.has(isoDate) ? next.delete(isoDate) : next.add(isoDate);
      return next;
    });
  }, []);

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Couldn't load the calendar"
        description={error}
      />
    );
  }

  if (loading) {
    return (
      <S.GridWrapper aria-busy="true" aria-label="Loading calendar">
        <Skeleton active paragraph={{ rows: 10 }} />
      </S.GridWrapper>
    );
  }

  return (
    <S.GridWrapper role="grid" aria-label={currentMonth.format("MMMM YYYY")}>
      {WEEKDAY_LABELS.map((label) => (
        <S.WeekdayHeader key={label} role="columnheader">
          {label}
        </S.WeekdayHeader>
      ))}

      {gridDays.map(({ date, isCurrentMonth }) => {
        const isoDate = date.format("YYYY-MM-DD");
        const dayAppointments = appointmentsByDate.get(isoDate) ?? [];
        const isExpanded = expandedDates.has(isoDate);
        const visibleAppointments = isExpanded
          ? dayAppointments
          : dayAppointments.slice(0, MAX_VISIBLE_EVENTS_PER_DAY);
        const hiddenCount = dayAppointments.length - visibleAppointments.length;
        const isToday = date.isSame(new Date(), "day");

        return (
          <S.DayCell
            key={isoDate}
            role="gridcell"
            $isCurrentMonth={isCurrentMonth}
            $isToday={isToday}
          >
            <S.DayHeader>
              <S.DayNumber $isCurrentMonth={isCurrentMonth} $isToday={isToday}>
                {date.date()}
              </S.DayNumber>
            </S.DayHeader>

            <S.EventList>
              {visibleAppointments.map((appt) => (
                <CalendarEventCard
                  key={appt.id}
                  time={appt.time}
                  patientName={appt.patientName}
                  status={appt.status}
                />
              ))}
            </S.EventList>

            {hiddenCount > 0 && (
              <S.MoreButton
                type="button"
                onClick={() => toggleExpanded(isoDate)}
                aria-expanded={isExpanded}
              >
                +{hiddenCount} more
              </S.MoreButton>
            )}
          </S.DayCell>
        );
      })}
    </S.GridWrapper>
  );
};

export default memo(ScheduleCalendar);