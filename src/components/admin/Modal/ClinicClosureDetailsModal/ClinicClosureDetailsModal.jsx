// src/components/admin/Modal/ClinicClosureDetailsModal/ClinicClosureDetailsModal.jsx
import { memo } from 'react';
import { Modal, Button, Divider, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined, ClockCircleOutlined, BuildOutlined, FileTextOutlined, BranchesOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { CLOSURE_TYPE_CONFIG, CLOSURE_STATUS_CONFIG } from '../../../../data/admin/clinicClosures';
import * as S from './ClinicClosureDetailsModal.styled';

const ClinicClosureDetailsModal = memo(({
  open,
  closure,
  onClose,
  onEdit,
  onDelete,
  loading,
}) => {
  if (!closure) return null;

  const branchName = closure.branch?.name || '—';
  const title = closure.title || '—';
  const closureType = closure.closure_type || 'other';
  const reason = closure.reason || '—';
  const startDate = closure.start_date ? dayjs(closure.start_date).format('MMMM D, YYYY') : '—';
  const endDate = closure.end_date ? dayjs(closure.end_date).format('MMMM D, YYYY') : '—';
  const isAllDay = closure.is_all_day ?? true;
  const startTime = closure.start_time ? dayjs(closure.start_time, 'HH:mm:ss').format('h:mm A') : '—';
  const endTime = closure.end_time ? dayjs(closure.end_time, 'HH:mm:ss').format('h:mm A') : '—';
  const affectsBooking = closure.affects_booking ? 'Yes' : 'No';
  const isCancelled = closure.is_cancelled || false;

  // Status (computed from dates)
  const now = dayjs();
  const today = now.startOf('day');
  let status = 'scheduled';
  if (isCancelled) {
    status = 'cancelled';
  } else {
    const start = dayjs(closure.start_date);
    const end = dayjs(closure.end_date);
    if (start <= today && today <= end) {
      status = 'active';
    } else if (end < today) {
      status = 'past';
    }
  }

  const typeConfig = CLOSURE_TYPE_CONFIG[closureType] || { label: closureType, icon: FileTextOutlined };
  const TypeIcon = typeConfig.icon || FileTextOutlined;
  const statusConfig = CLOSURE_STATUS_CONFIG[status] || { label: status, color: '#686868', bg: 'rgba(104,104,104,0.2)' };

  const dateDisplay = startDate === endDate ? startDate : `${startDate} – ${endDate}`;
  const timeDisplay = isAllDay ? 'All day' : `${startTime} - ${endTime}`;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={560}
      destroyOnHidden
      styles={{
        body: { padding: '0 24px 24px' },
        content: { borderRadius: '16px', overflow: 'hidden' },
        header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px', marginBottom: 0 },
      }}
      title={
        <S.ModalHeader>
          <S.TitleSection>
            <S.ClosureTitle>{title}</S.ClosureTitle>
            <S.ClosureSubtitle>Closure #{closure.id?.slice(0, 8) || '—'}</S.ClosureSubtitle>
          </S.TitleSection>
        </S.ModalHeader>
      }
    >
      {/* ── Action Buttons at Top ── */}
      <S.ActionRow>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            onClose();
            onEdit(closure);
          }}
          loading={loading}
        >
          Edit Closure
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            onClose();
            onDelete(closure.id);
          }}
          loading={loading}
        >
          Delete Closure
        </Button>
      </S.ActionRow>

      {/* ── Badges ── */}
      <S.BadgeSection>
        <S.StatusBadge $color={statusConfig.color} $bg={statusConfig.bg}>
          <S.StatusDot $color={statusConfig.color} />
          {statusConfig.label}
        </S.StatusBadge>
        <S.TypeBadge>
          <TypeIcon />
          {typeConfig.label}
        </S.TypeBadge>
        <S.BranchBadge>
          <BranchesOutlined /> {branchName}
        </S.BranchBadge>
      </S.BadgeSection>

      <Divider style={{ margin: '12px 0 16px' }} />

      {/* ── Info Grid ── */}
      <S.InfoGrid>
        <Row gutter={[16, 12]}>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>
                <CalendarOutlined /> Date
              </S.InfoLabel>
              <S.InfoValue>{dateDisplay}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>
                <ClockCircleOutlined /> Time
              </S.InfoLabel>
              <S.InfoValue>{timeDisplay}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>
                <FileTextOutlined /> Reason
              </S.InfoLabel>
              <S.InfoValue>{reason}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>
                <BuildOutlined /> Affects Booking
              </S.InfoLabel>
              <S.InfoValue>{affectsBooking}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>Created At</S.InfoLabel>
              <S.InfoValue>{closure.created_at ? dayjs(closure.created_at).format('MMM D, YYYY h:mm A') : '—'}</S.InfoValue>
            </S.InfoItem>
          </Col>
        </Row>
      </S.InfoGrid>
    </Modal>
  );
});

export default ClinicClosureDetailsModal;