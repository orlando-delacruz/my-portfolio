// src/components/admin/Modal/AppointmentDetailsModal/AppointmentDetailsModal.jsx
import { memo, useState, useEffect, useMemo } from 'react';
import { Modal, Card, Tag, Dropdown, Button, Spin, Divider, Tooltip, Typography } from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ScheduleOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getAppointmentById } from '../../../../services/appointments';
import { dbStatusToForm } from '../../../../services/appointments';
import * as S from './AppointmentDetailsModal.styled';

const { Text } = Typography;

// ── Status Badge ──
const StatusBadge = memo(({ status }) => {
  const config = {
    pending: { color: '#F2B90F', icon: <ExclamationCircleOutlined />, label: 'Pending' },
    confirmed: { color: '#1976D2', icon: <CheckCircleOutlined />, label: 'Confirmed' },
    completed: { color: '#11D896', icon: <CheckCircleOutlined />, label: 'Completed' },
    cancelled: { color: '#F81313', icon: <CloseCircleOutlined />, label: 'Cancelled' },
    rejected: { color: '#F81313', icon: <CloseCircleOutlined />, label: 'Rejected' },
  };
  const cfg = config[status] || { color: '#686868', icon: <ExclamationCircleOutlined />, label: status };
  return <Tag icon={cfg.icon} color={cfg.color}>{cfg.label}</Tag>;
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
        .then((data) => setAppointment(data))
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

  const status = useMemo(() => {
    if (!appointment) return 'pending';
    return dbStatusToForm(appointment.approval_status, appointment.appointment_status);
  }, [appointment]);

  // ── Status dropdown items ──
  const statusItems = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const handleStatusChange = (key) => {
    if (appointment) {
      onSetStatus(appointment.id, key);
    }
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

    // Use confirmed date/time if available, otherwise preferred
    const displayDate = appointment.confirmed_date || appointment.preferred_date;
    const displayTime = appointment.confirmed_time || appointment.preferred_time;
    const dateStr = displayDate ? dayjs(displayDate).format('MMMM D, YYYY') : '—';
    const timeStr = displayTime ? dayjs(displayTime, 'HH:mm:ss').format('h:mm A') : '—';

    const isWalkIn = appointment.is_walk_in || false;
    const referenceNumber = appointment.reference_number || '—';

    return (
      <S.Content>
        {/* Header with patient name */}
        <S.Header>
          <S.PatientInfo>
            <S.PatientName>{fullName || '—'}</S.PatientName>
            <S.PatientMeta>
              <StatusBadge status={status} />
              <Tag icon={<ScheduleOutlined />} color="#886217">
                {appointment.service_branch?.branch?.name || '—'}
              </Tag>
              <span>{dateStr} • {timeStr}</span>
            </S.PatientMeta>
          </S.PatientInfo>
        </S.Header>

        <Divider style={{ margin: '8px 0 16px' }} />

        {/* ── Action Buttons Container ── */}
        <S.ActionContainer>
          <Tooltip title="Set appointment status">
            <Dropdown
              menu={{
                items: statusItems.map((item) => ({
                  key: item.key,
                  label: item.label,
                  onClick: () => handleStatusChange(item.key),
                })),
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                style={{ borderRadius: '8px', fontWeight: 500 }}
              >
                Set Status
              </Button>
            </Dropdown>
          </Tooltip>

          <Tooltip title="Reschedule this appointment">
            <Button
              type="default"
              icon={<CalendarOutlined />}
              size="small"
              onClick={() => onReschedule(appointment.id)}
              style={{
                borderRadius: '8px',
                fontWeight: 500,
                background: '#f0ad4e',
                borderColor: '#f0ad4e',
                color: '#fff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ec971f';
                e.currentTarget.style.borderColor = '#ec971f';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f0ad4e';
                e.currentTarget.style.borderColor = '#f0ad4e';
              }}
            >
              Reschedule
            </Button>
          </Tooltip>
        </S.ActionContainer>

        {/* Section 1: Appointment Information */}
        <Card title={<S.SectionTitle><CalendarOutlined /> Appointment Information</S.SectionTitle>} size="small" bordered={false}>
          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoLabel>Reference Number</S.InfoLabel>
              <S.InfoValue>
                <Text copyable={{ icon: [<CopyOutlined key="copy" />, <CopyOutlined key="copied" />] }}>
                  {referenceNumber}
                </Text>
              </S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Appointment Status</S.InfoLabel>
              <S.InfoValue><StatusBadge status={status} /></S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Approval Status</S.InfoLabel>
              <S.InfoValue>{appointment.approval_status || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Booking Source</S.InfoLabel>
              <S.InfoValue>
                {isWalkIn ? (
                  <Tag color="purple">Walk-in</Tag>
                ) : (
                  <Tag color="blue">Online</Tag>
                )}
              </S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Created At</S.InfoLabel>
              <S.InfoValue>{dayjs(appointment.created_at).format('MMM D, YYYY h:mm A')}</S.InfoValue>
            </S.InfoItem>
          </S.InfoGrid>
        </Card>

        {/* Section 2: Patient Information */}
        <Card title={<S.SectionTitle><UserOutlined /> Patient Information</S.SectionTitle>} size="small" bordered={false}>
          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoLabel>Full Name</S.InfoLabel>
              <S.InfoValue>{fullName || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Gender</S.InfoLabel>
              <S.InfoValue>{patient.gender || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Birthdate</S.InfoLabel>
              <S.InfoValue>
                {patient.birth_date ? dayjs(patient.birth_date).format('MMM D, YYYY') : '—'}
                {age !== null && ` (${age} yrs)`}
              </S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Mobile Number</S.InfoLabel>
              <S.InfoValue><PhoneOutlined /> {patient.phone_number || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Email</S.InfoLabel>
              <S.InfoValue><MailOutlined /> {patient.email || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Address</S.InfoLabel>
              <S.InfoValue><EnvironmentOutlined /> {patient.address || '—'}</S.InfoValue>
            </S.InfoItem>
          </S.InfoGrid>
        </Card>

        {/* Section 3: Appointment Schedule */}
        <Card title={<S.SectionTitle><ScheduleOutlined /> Appointment Schedule</S.SectionTitle>} size="small" bordered={false}>
          <S.InfoGrid>
            <S.InfoItem>
              <S.InfoLabel>Branch</S.InfoLabel>
              <S.InfoValue>{appointment.service_branch?.branch?.name || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Service</S.InfoLabel>
              <S.InfoValue>{appointment.snapshot_service_name || appointment.service_branch?.service?.name || '—'}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Appointment Date</S.InfoLabel>
              <S.InfoValue>{dateStr}</S.InfoValue>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoLabel>Appointment Time</S.InfoLabel>
              <S.InfoValue>{timeStr}</S.InfoValue>
            </S.InfoItem>
          </S.InfoGrid>
        </Card>

        {/* Section 4: Notes */}
        <Card title={<S.SectionTitle><FileTextOutlined /> Notes & Remarks</S.SectionTitle>} size="small" bordered={false}>
          <S.NotesSection>
            <S.NoteLabel>Chief Complaint</S.NoteLabel>
            <S.NoteText>{appointment.chief_complaint || 'No notes provided'}</S.NoteText>
          </S.NotesSection>
          <S.NotesSection>
            <S.NoteLabel>Admin Notes</S.NoteLabel>
            <S.NoteText>{appointment.admin_notes || 'No notes provided'}</S.NoteText>
          </S.NotesSection>
        </Card>
      </S.Content>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnHidden
      aria-label="Appointment details"
      styles={{ body: { padding: '16px 24px' } }}
    >
      {renderContent()}
    </Modal>
  );
});

AppointmentDetailsModal.displayName = 'AppointmentDetailsModal';
export default AppointmentDetailsModal;