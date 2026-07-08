// src/pages/admin/Calendar/sections/ScheduleCalendar/ScheduleCalendar.jsx
import { memo, useMemo, useState, useCallback } from 'react';
import { Alert, Skeleton, Tooltip } from 'antd';
import CalendarEventCard from '../../../../../components/admin/Card/CalendarEventCard';
import useCalendarStore from '../../../../../store/useCalendarStore';
import { buildCalendarGrid } from '../../../../../utils/calendarGrid';
import { useCalendarIndicators } from '../../../../../hooks/useCalendarIndicators';
import {
  WEEKDAY_LABELS,
  MAX_VISIBLE_EVENTS_PER_DAY,
} from '../../../../../constants/calendarConstants';
import * as S from './ScheduleCalendar.styled';

const ScheduleCalendar = memo(({ appointmentsByDate, loading, error, onEventClick }) => {
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const branchId = useCalendarStore((s) => s.branchId);

  // Get combined indicators (clinic closures + recurring events)
  const { indicators, loading: indicatorsLoading } = useCalendarIndicators(branchId, currentMonth);

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
    return <Alert type="error" showIcon title="Couldn't load the calendar" description={error} />;
  }

  if (loading || indicatorsLoading) {
    return (
      <S.GridWrapper aria-busy="true" aria-label="Loading calendar">
        <Skeleton active paragraph={{ rows: 10 }} />
      </S.GridWrapper>
    );
  }

  return (
    <S.GridWrapper role="grid" aria-label={currentMonth.format('MMMM YYYY')}>
      {WEEKDAY_LABELS.map((label) => (
        <S.WeekdayHeader key={label} role="columnheader">
          {label}
        </S.WeekdayHeader>
      ))}

      {gridDays.map(({ date, isCurrentMonth }) => {
        const isoDate = date.format('YYYY-MM-DD');
        const dayAppointments = appointmentsByDate.get(isoDate) ?? [];
        const isExpanded = expandedDates.has(isoDate);
        const visibleAppointments = isExpanded
          ? dayAppointments
          : dayAppointments.slice(0, MAX_VISIBLE_EVENTS_PER_DAY);
        const hiddenCount = dayAppointments.length - visibleAppointments.length;
        const isToday = date.isSame(new Date(), 'day');

        // Get all indicators for this date
        const dateIndicators = indicators.get(isoDate) || [];
        const hasClosure = dateIndicators.some(ind => ind.type === 'closure');

        return (
          <S.DayCell
            key={isoDate}
            role="gridcell"
            $isCurrentMonth={isCurrentMonth}
            $isToday={isToday}
            $hasClosure={hasClosure}
          >
            <S.DayHeader $hasClosure={hasClosure}>
              <Tooltip
                title={dateIndicators.map(ind => ind.title).join(' • ')}
                placement="top"
                color="#886217"
              >
                <S.DayNumber $isCurrentMonth={isCurrentMonth} $isToday={isToday} $hasClosure={hasClosure}>
                  {date.date()}
                </S.DayNumber>
              </Tooltip>
            </S.DayHeader>

            {/* Render indicators */}
            <S.IndicatorsContainer>
              {dateIndicators.map((ind, idx) => (
                <S.IndicatorBadge key={idx} $type={ind.type}>
                  {ind.title}
                </S.IndicatorBadge>
              ))}
            </S.IndicatorsContainer>

            <S.EventList>
              {visibleAppointments.map((appt) => (
                <CalendarEventCard
                  key={appt.id}
                  time={appt.time}
                  patientName={appt.patientName}
                  status={appt.status}
                  onClick={() => onEventClick(appt.id)}
                  branchInitial={appt.branchInitial}
                  branchColor={appt.branchColor}
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
});

ScheduleCalendar.displayName = 'ScheduleCalendar';
export default ScheduleCalendar;