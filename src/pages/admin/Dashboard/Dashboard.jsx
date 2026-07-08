// src/pages/admin/Dashboard/Dashboard.jsx
import React, { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, Tooltip, message } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  MdCalendarToday,
  MdUpcoming,
  MdCheckCircle,
  MdPendingActions,
  MdBookOnline,
  MdAssessment,
  MdSchedule,
  MdPersonAdd,
} from "react-icons/md";
import { BsCalendar2Check } from "react-icons/bs";
import { FiXCircle } from "react-icons/fi";

import AdminLayout from "../../../components/admin/AdminLayout";
import { useAuthStore } from "../../../store/authStore";
import useDashboard from "./useDashboard";
import { useDashboardData } from "../../../hooks/useDashboardData";
import { useRealtimeAppointments } from "../../../hooks/useRealtimeAppointments";
import { quickActions } from "../../../data/admin/dashboard";
import {
  AddAppointmentModal,
  RescheduleModal,
  useAppointmentModal,
} from "../../../components/admin/Modal/AppointmentModal";
import AppointmentDetailsModal from "../../../components/admin/Modal/AppointmentDetailsModal";
import { STATUS_CONFIG } from "../../../data/admin/appointment";
import { adminUpdateAppointmentStatus } from "../../../services/appointments";
import * as S from "./Dashboard.styled";

// ── Extend dayjs ──
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

// ── Activity Icons ──
const ACTIVITY_ICONS = {
  created: BsCalendar2Check,
  status_changed: MdCheckCircle,
  cancelled: FiXCircle,
  rescheduled: MdSchedule,
  default: BsCalendar2Check,
};

// ── Status Badge ──
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

// ── Stats Card ──
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

// ── Main Dashboard ──
const Dashboard = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);
  const authLoading = useAuthStore((state) => state.loading);
  const user = useAuthStore((state) => state.user);

  const { greeting, formattedDate, dayName } = useDashboard(profile, user);
  const { data, loading: dashboardLoading, error, refetch } = useDashboardData();
  useRealtimeAppointments(() => refetch());

  const {
    addOpen, addLoading, openAdd, closeAdd, handleAdd,
    rescheduleOpen, rescheduleLoading, rescheduleTargetId,
    openReschedule, closeReschedule, handleReschedule,
  } = useAppointmentModal({
    onAddSuccess: () => refetch(),
    onRescheduleSuccess: () => refetch(),
  });

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const goTo = useCallback((path) => navigate(path), [navigate]);

  const handleQuickAction = useCallback((action) => {
    if (action.id === 'qa1') {
      openAdd();
    } else if (action.id === 'qa4') {
      goTo('/admin/appointments');
    } else if (action.id === 'qa3') {
      navigate('/admin/clinic-closures', { state: { openAddModal: true } });
    } else {
      goTo('/admin/dashboard');
    }
  }, [openAdd, goTo, navigate]);

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
      {
        id: 'walkins',
        label: "Today's Walk-ins",
        icon: MdPersonAdd,
        iconColor: '#B75DEB',
        note: 'walk-in patients',
        noteColor: '#B75DEB',
        value: data?.walkInCount ?? 0,
      },
    ],
    [data]
  );

  const handleViewAppointment = useCallback(() => {
    const nextAppt = data?.nextAppointment;
    if (nextAppt?.id) {
      setSelectedAppointmentId(nextAppt.id);
      setDetailsModalOpen(true);
    }
  }, [data?.nextAppointment]);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedAppointmentId(null);
  }, []);

  const handleSetStatusFromDetails = useCallback(
    async (id, newStatus) => {
      try {
        await adminUpdateAppointmentStatus({
          appointmentId: id,
          status: newStatus,
          adminId: profile?.id,
        });
        message.success(`Status updated to ${newStatus}.`);
        await refetch();
        handleCloseDetails();
      } catch (err) {
        console.error(err);
        message.error('Failed to update status. Please try again.');
      }
    },
    [profile, refetch, handleCloseDetails]
  );

  const handleRescheduleFromDetails = useCallback(
    (appointmentId) => {
      handleCloseDetails();
      openReschedule(appointmentId);
    },
    [handleCloseDetails, openReschedule]
  );

  const isLoading = authLoading || dashboardLoading;

  if (isLoading) {
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
            title="Failed to load dashboard"
            description={error}
            showIcon
          />
        </S.Page>
      </AdminLayout>
    );
  }

  const schedule = data?.schedule ?? [];
  const upcoming = data?.upcoming ?? [];
  const activity = data?.activity ?? [];
  const nextAppointment = data?.nextAppointment ?? {
    patient: 'No upcoming appointments',
    time: '-',
    date: '-',
    service: '-',
    avatarColor: '#888888',
    id: null,
  };
  const walkIns = data?.walkIns ?? [];

  return (
    <AdminLayout>
      <S.Page>
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

        <S.StatsGrid role="list" aria-label="Clinic statistics">
          {statsConfig.map((stat) => (
            <StatCard key={stat.id} stat={stat} value={stat.value} />
          ))}
        </S.StatsGrid>

        <S.TwoColGrid>
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
              <S.ViewApptBtn
                onClick={handleViewAppointment}
                disabled={!nextAppointment.id}
              >
                View Appointment
              </S.ViewApptBtn>
            </div>
          </S.NextApptCard>

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
            <S.ScheduleScrollWrapper>
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
            </S.ScheduleScrollWrapper>
          </S.ScheduleCard>
        </S.TwoColGrid>

        <S.ThreeColGrid>
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

          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <MdPersonAdd aria-hidden="true" />
                Today's Walk-ins
              </S.PanelTitle>
            </S.PanelHeader>
            <S.PanelContent>
              {walkIns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: '13px' }}>
                  No walk-in patients today.
                </div>
              ) : (
                walkIns.map((walkin) => (
                  <S.ApptRow key={walkin.id} role="listitem">
                    <S.ApptLeft>
                      <S.ApptAvatar $color="#B75DEB" aria-hidden="true">
                        {walkin.patient_name?.[0] ?? '?'}
                      </S.ApptAvatar>
                      <S.ApptDetails>
                        <S.ApptName>{walkin.patient_name}</S.ApptName>
                        <S.ApptService>{walkin.service}</S.ApptService>
                      </S.ApptDetails>
                    </S.ApptLeft>
                    <S.ApptRight>
                      <S.ApptDate>{walkin.time}</S.ApptDate>
                      <S.ApptTime>{walkin.branch}</S.ApptTime>
                    </S.ApptRight>
                  </S.ApptRow>
                ))
              )}
            </S.PanelContent>
          </S.Panel>

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
                  const isComingSoon = action.isComingSoon || false;
                  const hasFunctionality = ['qa1', 'qa3', 'qa4'].includes(action.id);
                  const handleClick = hasFunctionality
                    ? () => handleQuickAction(action)
                    : () => goTo('/admin/dashboard');

                  const button = (
                    <S.QuickBtn
                      $color={action.color}
                      $bg={action.bg}
                      onClick={handleClick}
                      aria-label={action.label}
                      role="listitem"
                      style={{ opacity: isComingSoon ? 0.5 : 1 }}
                    >
                      <ActionIcon aria-hidden="true" />
                      <span>{action.label}</span>
                    </S.QuickBtn>
                  );

                  return isComingSoon ? (
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

      <AddAppointmentModal
        open={addOpen}
        loading={addLoading}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />

      <RescheduleModal
        open={rescheduleOpen}
        appointmentId={rescheduleTargetId}
        loading={rescheduleLoading}
        onClose={closeReschedule}
        onSubmit={handleReschedule}
      />

      <AppointmentDetailsModal
        open={detailsModalOpen}
        appointmentId={selectedAppointmentId}
        onClose={handleCloseDetails}
        onSetStatus={handleSetStatusFromDetails}
        onReschedule={handleRescheduleFromDetails}
      />
    </AdminLayout>
  );
};

export default memo(Dashboard);