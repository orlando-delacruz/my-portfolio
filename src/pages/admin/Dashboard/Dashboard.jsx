// src/pages/admin/Dashboard/Dashboard.jsx
import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Alert, Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {
  MdCalendarToday,
  MdUpcoming,
  MdCheckCircle,
  MdPendingActions,
  MdBookOnline,
  MdAssessment,
  MdSchedule,
} from 'react-icons/md';
import { BsCalendar2Check } from 'react-icons/bs';
import { FiXCircle } from 'react-icons/fi';

import AdminLayout from '../../../components/admin/AdminLayout';
import useDashboard from './useDashboard';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { useRealtimeAppointments } from '../../../hooks/useRealtimeAppointments';
import { quickActions } from '../../../data/admin/dashboard';
import {
  AddAppointmentModal,
  useAppointmentModal,
} from '../../../components/admin/Modal/AppointmentModal';
import { STATUS_CONFIG } from '../../../data/admin/appointment';
import * as S from './Dashboard.styled';

// ── Extend dayjs with relative time plugins ──────────────────
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Just now',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: '1 day',
    dd: '%d days',
    M: '1 month',
    MM: '%d months',
    y: '1 year',
    yy: '%d years',
  },
});

// ── Constants ────────────────────────────────────────────
const ACTIVITY_ICONS = {
  created: BsCalendar2Check,
  status_changed: MdCheckCircle,
  cancelled: FiXCircle,
  rescheduled: MdSchedule,
  default: BsCalendar2Check,
};

// ── Status Badge Component ──────────────────────────────
const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: '#686868',
    bg: 'rgba(104,104,104,0.2)',
  };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} aria-hidden="true" />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ── Stats Card Component ─────────────────────────────────
const StatCard = memo(({ stat, value }) => {
  const Icon = stat.icon;
  return (
    <S.StatCard role="listitem">
      <S.StatIconWrap $color={stat.iconColor} aria-hidden="true">
        <Icon />
      </S.StatIconWrap>
      <S.StatBody>
        <S.StatLabel>{stat.label}</S.StatLabel>
        <S.StatValue>{value ?? 0}</S.StatValue>
        <S.StatNote $color={stat.noteColor}>{stat.note}</S.StatNote>
      </S.StatBody>
    </S.StatCard>
  );
});
StatCard.displayName = 'StatCard';

// ── Main Dashboard ────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { greeting, formattedDate, dayName } = useDashboard('DOCTOR YENYEN');

  // ── Fetch real dashboard data ──────────────────────────
  const { data, loading, error, refetch } = useDashboardData();

  // ── Realtime updates ────────────────────────────────────
  useRealtimeAppointments(() => {
    refetch();
  });

  // ── Modal hook ──────────────────────────────────────────
  const {
    addOpen, addLoading, openAdd, closeAdd, handleAdd,
  } = useAppointmentModal({
    onAddSuccess: () => refetch(),
  });

  // ── Navigation helpers ──────────────────────────────────
  const goTo = useCallback((path) => navigate(path), [navigate]);

  // ── Handle quick action clicks ──────────────────────────
  const handleQuickAction = useCallback((action) => {
    if (action.id === 'qa1') {
      openAdd(); // Book Appointment
    } else if (action.id === 'qa4') {
      goTo('/admin/appointments'); // Appointment List
    } else {
      // Other actions are placeholders
      goTo('/admin/dashboard');
    }
  }, [openAdd, goTo]);

  // ── Stats mapping ───────────────────────────────────────
  const statsConfig = useMemo(
    () => [
      {
        id: 'today',
        label: "Today's Appointment",
        icon: MdCalendarToday,
        iconColor: '#E963C8',
        note: 'Today',
        noteColor: '#E963C8',
        value: data?.stats?.today ?? 0,
      },
      {
        id: 'upcoming',
        label: 'Upcoming',
        icon: MdUpcoming,
        iconColor: '#1976D2',
        note: 'next 7 days',
        noteColor: '#1976D2',
        value: data?.stats?.upcoming ?? 0,
      },
      {
        id: 'completed',
        label: 'Completed',
        icon: MdCheckCircle,
        iconColor: '#11D896',
        note: 'today',
        noteColor: '#11D896',
        value: data?.stats?.completed ?? 0,
      },
      {
        id: 'pending',
        label: 'Pending',
        icon: MdPendingActions,
        iconColor: '#FFA000',
        note: 'today',
        noteColor: '#FFA000',
        value: data?.stats?.pending ?? 0,
      },
    ],
    [data]
  );

  // ── Loading / Error states ─────────────────────────────
  if (loading) {
    return (
      <AdminLayout>
        <S.Page>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spin size="large" description="Loading dashboard..." />
          </div>
        </S.Page>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.Page>
          <Alert
            type="error"
            message="Failed to load dashboard"
            description={error}
            showIcon
          />
        </S.Page>
      </AdminLayout>
    );
  }

  // ── Extract data with fallbacks ────────────────────────
  const schedule = data?.schedule ?? [];
  const upcoming = data?.upcoming ?? [];
  const activity = data?.activity ?? [];
  const nextAppointment = data?.nextAppointment ?? {
    patient: 'No upcoming appointments',
    time: '-',
    date: '-',
    service: '-',
    avatarColor: '#888888',
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <AdminLayout>
      <S.Page>
        {/* ── Welcome bar ─────────────────────────────────── */}
        <S.WelcomeBar>
          <S.WelcomeText>
            <S.WelcomeHeading>{greeting}</S.WelcomeHeading>
            <S.WelcomeSubtitle>
              Here's what's happening to your clinic today.
            </S.WelcomeSubtitle>
          </S.WelcomeText>

          <S.DateBadge aria-label={`Today: ${formattedDate}, ${dayName}`}>
            <MdCalendarToday aria-hidden="true" />
            <S.DateInfo>
              <S.DateText>{formattedDate}</S.DateText>
              <S.DayText>{dayName}</S.DayText>
            </S.DateInfo>
          </S.DateBadge>
        </S.WelcomeBar>

        {/* ── Stat cards ───────────────────────────────────── */}
        <S.StatsGrid role="list" aria-label="Clinic statistics">
          {statsConfig.map((stat) => (
            <StatCard key={stat.id} stat={stat} value={stat.value} />
          ))}
        </S.StatsGrid>

        {/* ── Next Appt + Schedule ────────────────────────── */}
        <S.TwoColGrid>
          {/* Next appointment */}
          <S.NextApptCard aria-label="Next appointment details">
            <S.NextApptLabel>
              <BsCalendar2Check aria-hidden="true" />
              Next Appointment
            </S.NextApptLabel>

            <S.NextApptBody>
              <S.AvatarCircle $color={nextAppointment.avatarColor} aria-hidden="true">
                {nextAppointment.patient?.[0] ?? '?'}
              </S.AvatarCircle>
              <S.NextApptInfo>
                <S.NextApptName>{nextAppointment.patient}</S.NextApptName>
                <S.NextApptMeta>
                  <S.TimeBadge>{nextAppointment.time}</S.TimeBadge>
                  <S.NextApptDate>{nextAppointment.date}</S.NextApptDate>
                </S.NextApptMeta>
                <S.NextApptService>{nextAppointment.service}</S.NextApptService>
              </S.NextApptInfo>
            </S.NextApptBody>

            <div>
              <S.Divider />
              <S.ViewApptBtn onClick={() => goTo('/admin/appointments')}>
                View Appointment
              </S.ViewApptBtn>
            </div>
          </S.NextApptCard>

          {/* Today's schedule table */}
          <S.ScheduleCard>
            <S.ScheduleHeader>
              <S.ScheduleTitle>
                <MdCalendarToday aria-hidden="true" />
                Today's Schedule
              </S.ScheduleTitle>
              <S.ViewCalendarLink onClick={() => goTo('/admin/calendar')}>
                View Calendar
              </S.ViewCalendarLink>
            </S.ScheduleHeader>

            <S.ScheduleTable>
              <S.ScheduleThead>
                <tr>
                  <S.ScheduleTh scope="col">Time</S.ScheduleTh>
                  <S.ScheduleTh scope="col">Patient</S.ScheduleTh>
                  <S.ScheduleTh scope="col">Services</S.ScheduleTh>
                  <S.ScheduleTh scope="col">Status</S.ScheduleTh>
                </tr>
              </S.ScheduleThead>
              <tbody>
                {schedule.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
                      No appointments scheduled for today
                    </td>
                  </tr>
                ) : (
                  schedule.map((row) => (
                    <tr key={row.id}>
                      <S.ScheduleTd>{row.time}</S.ScheduleTd>
                      <S.ScheduleTd>{row.patient}</S.ScheduleTd>
                      <S.ScheduleTd>{row.service}</S.ScheduleTd>
                      <S.ScheduleTd>
                        <StatusBadge status={row.status} />
                      </S.ScheduleTd>
                    </tr>
                  ))
                )}
              </tbody>
            </S.ScheduleTable>
          </S.ScheduleCard>
        </S.TwoColGrid>

        {/* ── 3-col grid ────────────────────────────────────── */}
        <S.ThreeColGrid>
          {/* Upcoming appointments */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <BsCalendar2Check aria-hidden="true" />
                Upcoming Appointment
              </S.PanelTitle>
              <S.ViewAllLink onClick={() => goTo('/admin/appointments')}>
                View All
              </S.ViewAllLink>
            </S.PanelHeader>
            <S.PanelContent>
              {upcoming.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
                  No upcoming appointments
                </div>
              ) : (
                upcoming.map((appt) => (
                  <S.ApptRow key={appt.id} role="listitem">
                    <S.ApptLeft>
                      <S.ApptAvatar $color={appt.avatar_color} aria-hidden="true">
                        {appt.patient_name?.[0] ?? '?'}
                      </S.ApptAvatar>
                      <S.ApptDetails>
                        <S.ApptName>{appt.patient_name}</S.ApptName>
                        <S.ApptService>{appt.service}</S.ApptService>
                      </S.ApptDetails>
                    </S.ApptLeft>
                    <S.ApptRight>
                      <S.ApptDate>{appt.appointment_date}</S.ApptDate>
                      <S.ApptTime>{appt.appointment_time}</S.ApptTime>
                    </S.ApptRight>
                  </S.ApptRow>
                ))
              )}
            </S.PanelContent>
          </S.Panel>

          {/* Recent activity */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <MdAssessment aria-hidden="true" />
                Recent Activity
              </S.PanelTitle>
            </S.PanelHeader>
            <S.PanelContent>
              {activity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
                  No recent activity
                </div>
              ) : (
                activity.map((item) => {
                  const Icon = ACTIVITY_ICONS[item.type] ?? ACTIVITY_ICONS.default;
                  const relativeTime = item.raw_timestamp
                    ? dayjs(item.raw_timestamp).fromNow()
                    : item.activity_time;
                  const exactTime = item.raw_timestamp
                    ? dayjs(item.raw_timestamp).format('MMM D, YYYY h:mm A')
                    : '';

                  return (
                    <S.ActivityRow key={item.id} role="listitem">
                      <S.ActivityLeft>
                        <S.ActivityIconWrap $color={item.color} aria-hidden="true">
                          <Icon />
                        </S.ActivityIconWrap>
                        <S.ActivityMeta>
                          <S.ActivityTitle>{item.title}</S.ActivityTitle>
                          <S.ActivityDetail>{item.detail}</S.ActivityDetail>
                        </S.ActivityMeta>
                      </S.ActivityLeft>
                      <Tooltip title={exactTime || item.activity_time} placement="top">
                        <S.ActivityTime>{relativeTime}</S.ActivityTime>
                      </Tooltip>
                    </S.ActivityRow>
                  );
                })
              )}
            </S.PanelContent>
          </S.Panel>

          {/* Quick actions */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <MdBookOnline aria-hidden="true" />
                Quick Actions
              </S.PanelTitle>
            </S.PanelHeader>
            <S.PanelContent>
              <S.QuickGrid role="list">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  const isBookAppointment = action.id === 'qa1';
                  const isAppointmentList = action.id === 'qa4';
                  const hasFunctionality = isBookAppointment || isAppointmentList;
                  const handleClick = hasFunctionality
                    ? () => handleQuickAction(action)
                    : () => goTo('/admin/dashboard');

                  const showTooltip = !hasFunctionality;

                  const button = (
                    <S.QuickBtn
                      $color={action.color}
                      $bg={action.bg}
                      onClick={handleClick}
                      aria-label={action.label}
                      role="listitem"
                    >
                      <ActionIcon aria-hidden="true" />
                      <span>{action.label}</span>
                    </S.QuickBtn>
                  );

                  return showTooltip ? (
                    <Tooltip
                      key={action.id}
                      title="This feature is coming soon."
                      placement="top"
                      color="#886217"
                    >
                      {button}
                    </Tooltip>
                  ) : (
                    <React.Fragment key={action.id}>{button}</React.Fragment>
                  );
                })}
              </S.QuickGrid>
            </S.PanelContent>
          </S.Panel>
        </S.ThreeColGrid>
      </S.Page>

      {/* ── Add Appointment Modal ────────────────────────────── */}
      <AddAppointmentModal
        open={addOpen}
        loading={addLoading}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />
    </AdminLayout>
  );
};

export default memo(Dashboard);