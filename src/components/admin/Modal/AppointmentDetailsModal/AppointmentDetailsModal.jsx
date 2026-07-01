// src/components/admin/Modal/AppointmentDetailsModal/AppointmentDetailsModal.jsx
import { memo, useState, useEffect } from 'react';
import { Modal, Divider, Dropdown, Spin } from 'antd';
import dayjs from 'dayjs';
import { STATUS_CONFIG } from '../../../../data/admin/appointment';
import { getAppointmentById } from '../../../../services/appointments';
import * as S from './AppointmentDetailsModal.styled';

const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#686868', bg: 'rgba(104,104,104,0.2)' };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} aria-hidden="true" />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = 'StatusBadge';

const AppointmentDetailsModal = memo(({ open, appointmentId, onClose, onSetStatus, onReschedule }) => {
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && appointmentId) {
      setLoading(true);
      setError(null);
      getAppointmentById(appointmentId)
        .then((data) => {
          setAppointment(data);
        })
        .catch((err) => {
          console.error('Failed to fetch appointment details:', err);
          setError('Could not load appointment details. Please try again.');
        })
        .finally(() => setLoading(false));
    }
  }, [open, appointmentId]);

  useEffect(() => {
    if (!open) {
      setAppointment(null);
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const statusItems = [
    { key: 'completed', label: 'Completed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'pending', label: 'Pending' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const statusMenuProps = {
    items: statusItems.map((s) => ({
      key: s.key,
      label: s.label,
      onClick: () => onSetStatus(appointment.id, s.key),
    })),
  };

  const renderContent = () => {
    if (loading) {
      return <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>;
    }
    if (error) {
      return <div style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>{error}</div>;
    }
    if (!appointment) return null;

    const patient = appointment.patient || {};
    const fullName = [patient.first_name, patient.middle_name, patient.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
    const age = patient.birth_date ? dayjs().diff(dayjs(patient.birth_date), 'year') : null;

    return (
      <S.Content>
        <S.InfoGrid>
          <S.SectionTitle>Patient Information</S.SectionTitle>
          <S.InfoItem>
            <S.InfoLabel>Full Name</S.InfoLabel>
            <S.InfoValue>{fullName || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>First Name</S.InfoLabel>
            <S.InfoValue>{patient.first_name || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Middle Name</S.InfoLabel>
            <S.InfoValue>{patient.middle_name || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Last Name</S.InfoLabel>
            <S.InfoValue>{patient.last_name || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Contact Number</S.InfoLabel>
            <S.InfoValue>{patient.phone_number || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Email</S.InfoLabel>
            <S.InfoValue>{patient.email || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Birthdate</S.InfoLabel>
            <S.InfoValue>
              {patient.birth_date ? dayjs(patient.birth_date).format('MMM D, YYYY') : '—'}
              {age !== null && ` (${age} years)`}
            </S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Gender</S.InfoLabel>
            <S.InfoValue>{patient.gender || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem style={{ gridColumn: '1 / -1' }}>
            <S.InfoLabel>Address</S.InfoLabel>
            <S.InfoValue>{patient.address || '—'}</S.InfoValue>
          </S.InfoItem>

          <S.SectionTitle>Appointment Information</S.SectionTitle>
          <S.InfoItem>
            <S.InfoLabel>Reference No</S.InfoLabel>
            <S.InfoValue>{appointment.reference_number}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Branch</S.InfoLabel>
            <S.InfoValue>{appointment.service_branch?.branch?.name || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Service</S.InfoLabel>
            <S.InfoValue>{appointment.snapshot_service_name || appointment.service_branch?.service?.name || '—'}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Date</S.InfoLabel>
            <S.InfoValue>{dayjs(appointment.preferred_date).format('MMM D, YYYY')}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Time</S.InfoLabel>
            <S.InfoValue>{dayjs(appointment.preferred_time, 'HH:mm:ss').format('h:mm A')}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Status</S.InfoLabel>
            <StatusBadge status={
              appointment.appointment_status === 'cancelled' ? 'cancelled' :
                appointment.appointment_status === 'completed' ? 'completed' :
                  appointment.approval_status === 'approved' ? 'confirmed' : 'pending'
            } />
          </S.InfoItem>
          <S.InfoItem style={{ gridColumn: '1 / -1' }}>
            <S.InfoLabel>Notes</S.InfoLabel>
            <S.InfoValue>{appointment.chief_complaint || appointment.admin_notes || '—'}</S.InfoValue>
          </S.InfoItem>

          <S.SectionTitle>System Information</S.SectionTitle>
          <S.InfoItem>
            <S.InfoLabel>Created At</S.InfoLabel>
            <S.InfoValue>{dayjs(appointment.created_at).format('MMM D, YYYY h:mm A')}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Updated At</S.InfoLabel>
            <S.InfoValue>{dayjs(appointment.updated_at).format('MMM D, YYYY h:mm A')}</S.InfoValue>
          </S.InfoItem>
        </S.InfoGrid>
      </S.Content>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<S.ModalTitle>Appointment Details</S.ModalTitle>}
      width={700}
      centered
      destroyOnHidden
      aria-label="Appointment details"
    >
      {renderContent()}
      {appointment && !loading && !error && (
        <>
          <Divider />
          <S.Footer>
            <Dropdown menu={statusMenuProps} trigger={['click']}>
              <S.ActionBtn $variant="primary">Set Status</S.ActionBtn>
            </Dropdown>
            <S.ActionBtn
              $variant="secondary"
              onClick={() => {
                onReschedule(appointment.id);
              }}
            >
              Reschedule
            </S.ActionBtn>
          </S.Footer>
        </>
      )}
    </Modal>
  );
});

AppointmentDetailsModal.displayName = 'AppointmentDetailsModal';
export default AppointmentDetailsModal;