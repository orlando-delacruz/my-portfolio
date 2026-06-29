// src/pages/admin/Dashboard/Dashboard.jsx
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCalendarToday,
  MdEventNote,
  MdBookmarkAdd,
  MdAssessment,
} from "react-icons/md";
import {
  BsCalendar2Check,
  BsClipboardCheck,
  BsPersonPlus,
} from "react-icons/bs";
import { FiXCircle } from "react-icons/fi";

import AdminLayout from "../../../components/admin/AdminLayout";
import {
  dashboardStats,
  todaySchedule,
  nextAppointment,
  upcomingAppointments,
  recentActivity,
  quickActions,
} from "../../../data/admin/dashboard";
import useDashboard from "./useDashboard";
import * as S from "./Dashboard.styled";

// Maps activity type → react-icon component
const ACTIVITY_ICONS = {
  booked: BsCalendar2Check,
  completed: BsClipboardCheck,
  cancelled: FiXCircle,
  closure: MdEventNote,
  user: BsPersonPlus,
};

const STATUS_LABEL = {
  completed: "Completed",
  upcoming: "Upcoming",
  cancelled: "Cancelled",
};

const Dashboard = () => {
  const { greeting, formattedDate, dayName } = useDashboard("DOCTOR YENYEN");
  const navigate = useNavigate();

  const goTo = useCallback((path) => navigate(path), [navigate]);

  return (
    <AdminLayout>
      <S.Page>

        {/* ── Welcome bar ─────────────────────────────────────────── */}
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

        {/* ── Stat cards — now shows Pending instead of Cancelled ──── */}
        <S.StatsGrid role="list" aria-label="Clinic statistics">
          {dashboardStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <S.StatCard key={stat.id} role="listitem">
                <S.StatIconWrap $color={stat.iconColor} aria-hidden="true">
                  <Icon />
                </S.StatIconWrap>
                <S.StatBody>
                  <S.StatLabel>{stat.label}</S.StatLabel>
                  <S.StatValue>{stat.value}</S.StatValue>
                  <S.StatNote $color={stat.noteColor}>{stat.note}</S.StatNote>
                </S.StatBody>
              </S.StatCard>
            );
          })}
        </S.StatsGrid>

        {/* ── Next Appt + Schedule — 2 cols desktop / 1 col mobile ── */}
        <S.TwoColGrid>
          {/* Next appointment */}
          <S.NextApptCard aria-label="Next appointment details">
            <S.NextApptLabel>
              <BsCalendar2Check aria-hidden="true" />
              Next Appointment
            </S.NextApptLabel>

            <S.NextApptBody>
              <S.AvatarCircle $color={nextAppointment.avatarColor} aria-hidden="true">
                {nextAppointment.patient[0]}
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
              <S.ViewApptBtn onClick={() => goTo("/admin/appointments")}>
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
              <S.ViewCalendarLink onClick={() => goTo("/admin/calendar")}>
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
                {todaySchedule.map((row) => (
                  <tr key={row.id}>
                    <S.ScheduleTd>{row.time}</S.ScheduleTd>
                    <S.ScheduleTd>{row.patient}</S.ScheduleTd>
                    <S.ScheduleTd>{row.service}</S.ScheduleTd>
                    <S.ScheduleTd $status={row.status}>
                      {STATUS_LABEL[row.status]}
                    </S.ScheduleTd>
                  </tr>
                ))}
              </tbody>
            </S.ScheduleTable>
          </S.ScheduleCard>
        </S.TwoColGrid>

        {/* ── 3-col grid: Upcoming / Activity / Quick Actions ─────── */}
        <S.ThreeColGrid>

          {/* Upcoming appointments */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <BsCalendar2Check aria-hidden="true" />
                Upcoming Appointment
              </S.PanelTitle>
              <S.ViewAllLink onClick={() => goTo("/admin/appointments")}>
                View All
              </S.ViewAllLink>
            </S.PanelHeader>

            <div role="list" aria-label="Upcoming appointments">
              {upcomingAppointments.map((appt) => (
                <S.ApptRow key={appt.id} role="listitem">
                  <S.ApptLeft>
                    <S.ApptAvatar $color={appt.avatarColor} aria-hidden="true">
                      {appt.name[0]}
                    </S.ApptAvatar>
                    <S.ApptDetails>
                      <S.ApptName>{appt.name}</S.ApptName>
                      <S.ApptService>{appt.service}</S.ApptService>
                    </S.ApptDetails>
                  </S.ApptLeft>
                  <S.ApptRight>
                    <S.ApptDate>{appt.date}</S.ApptDate>
                    <S.ApptTime>{appt.time}</S.ApptTime>
                  </S.ApptRight>
                </S.ApptRow>
              ))}
            </div>
          </S.Panel>

          {/* Recent activity */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <MdAssessment aria-hidden="true" />
                Recent Activity
              </S.PanelTitle>
              <S.ViewAllLink>View All</S.ViewAllLink>
            </S.PanelHeader>

            <div role="list" aria-label="Recent activity">
              {recentActivity.map((item) => {
                const Icon = ACTIVITY_ICONS[item.type] ?? BsCalendar2Check;
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
                    <S.ActivityTime>{item.time}</S.ActivityTime>
                  </S.ActivityRow>
                );
              })}
            </div>
          </S.Panel>

          {/* Quick actions — now with icons */}
          <S.Panel>
            <S.PanelHeader>
              <S.PanelTitle>
                <MdBookmarkAdd aria-hidden="true" />
                Quick Actions
              </S.PanelTitle>
              <S.ViewAllLink>View All</S.ViewAllLink>
            </S.PanelHeader>

            <S.QuickGrid role="list">
              {quickActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <S.QuickBtn
                    key={action.id}
                    $color={action.color}
                    $bg={action.bg}
                    onClick={() => goTo(action.path)}
                    aria-label={action.label}
                    role="listitem"
                  >
                    <ActionIcon aria-hidden="true" />
                    <span>{action.label}</span>
                  </S.QuickBtn>
                );
              })}
            </S.QuickGrid>

            <S.GenerateReportBtn aria-label="Generate reports">
              <MdAssessment aria-hidden="true" />
              Generate Reports
            </S.GenerateReportBtn>
          </S.Panel>

        </S.ThreeColGrid>

      </S.Page>
    </AdminLayout>
  );
};

export default memo(Dashboard);