// src/pages/admin/Calendar/AppointmentCalendar/AppointmentCalendar.jsx
import { memo, useState, useCallback } from 'react';
import { message } from 'antd';
import AdminLayout from '../../../../components/admin/AdminLayout';
import PageTitle from '../sections/PageTitle';
import Toolbar from '../sections/Toolbar';
import ScheduleCalendar from '../sections/ScheduleCalendar';
import AppointmentDetailsModal from '../../../../components/admin/Modal/AppointmentDetailsModal';
import useCalendarStore from '../../../../store/useCalendarStore';
import useCalendarAppointments from '../../../../hooks/useCalendarAppointments';
import { useRealtimeAppointments } from '../../../../hooks/useRealtimeAppointments';
import { adminUpdateAppointmentStatus } from '../../../../services/appointments';
import { useAuthStore } from '../../../../store/authStore';
import * as S from './AppointmentCalendar.styled';

const AppointmentCalendar = () => {
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const branchId = useCalendarStore((s) => s.branchId);
  const [statusFilter, setStatusFilter] = useState('all');
  const { appointmentsByDate, loading, error, refetch } = useCalendarAppointments(
    currentMonth,
    branchId,
    statusFilter
  );

  // Realtime updates
  useRealtimeAppointments(() => {
    console.log('🔄 Realtime: appointments changed, refetching...');
    refetch();
  });

  // Modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const profile = useAuthStore((s) => s.profile);

  const handleEventClick = useCallback((appointmentId) => {
    console.log('📅 Event clicked:', appointmentId);
    setSelectedAppointmentId(appointmentId);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedAppointmentId(null);
  }, []);

  const handleSetStatus = useCallback(
    async (id, newStatus) => {
      try {
        await adminUpdateAppointmentStatus({
          appointmentId: id,
          status: newStatus,
          adminId: profile?.id,
        });
        message.success(`Status updated to ${newStatus}.`);
        await refetch();
        if (detailsModalOpen && selectedAppointmentId === id) {
          setDetailsModalOpen(false);
          setSelectedAppointmentId(null);
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to update status. Please try again.');
      }
    },
    [profile, refetch, detailsModalOpen, selectedAppointmentId]
  );

  const handleReschedule = useCallback(
    (appointmentId) => {
      setDetailsModalOpen(false);
      setSelectedAppointmentId(null);
      console.log('📅 Reschedule appointment:', appointmentId);
    },
    []
  );

  return (
    <>
      <AdminLayout>
        <S.PageRoot>
          <PageTitle
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          <S.CalendarArea>
            <Toolbar />
            <ScheduleCalendar
              appointmentsByDate={appointmentsByDate}
              loading={loading}
              error={error}
              onEventClick={handleEventClick}
            />
          </S.CalendarArea>
        </S.PageRoot>
      </AdminLayout>

      <AppointmentDetailsModal
        open={detailsModalOpen}
        appointmentId={selectedAppointmentId}
        onClose={handleCloseDetails}
        onSetStatus={handleSetStatus}
        onReschedule={handleReschedule}
      />
    </>
  );
};

export default memo(AppointmentCalendar);