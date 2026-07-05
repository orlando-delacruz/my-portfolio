// src/components/admin/Modal/PatientDetailsModal/PatientDetailsModal.jsx
import { memo } from 'react';
import { Modal, Avatar, Button, Divider, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { formatPhoneDisplay } from '../../../../utils/phoneFormatter';
import * as S from './PatientDetailsModal.styled';

const PatientDetailsModal = memo(({
  open,
  patient,
  onClose,
  onEdit,
  onDelete,
  loading,
}) => {
  if (!patient) return null;

  const fullName = `${patient.first_name || ''} ${patient.middle_name ? patient.middle_name + ' ' : ''}${patient.last_name || ''}`.trim() || '—';
  const email = patient.email || '—';
  const phone = patient.phone_number ? formatPhoneDisplay(patient.phone_number) : '—';
  const birthDate = patient.birth_date ? dayjs(patient.birth_date).format('MMM D, YYYY') : '—';
  const age = patient.birth_date ? dayjs().diff(dayjs(patient.birth_date), 'year') : null;
  const gender = patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '—';
  const address = patient.address || '—';
  const branchName = patient.branch?.name || '—';
  const isOrthodontic = patient.is_orthodontic || false;
  const notes = patient.notes || '—';
  const createdAt = patient.created_at ? dayjs(patient.created_at).format('MMM D, YYYY h:mm A') : '—';

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
            <S.PatientName>{fullName}</S.PatientName>
            <S.PatientSubtitle>Patient #{patient.patient_number || '—'}</S.PatientSubtitle>
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
            onEdit(patient);
          }}
          loading={loading}
        >
          Edit Patient
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            onClose();
            onDelete(patient.id);
          }}
          loading={loading}
        >
          Delete Patient
        </Button>
      </S.ActionRow>

      {/* ── Avatar & Badges ── */}
      <S.AvatarSection>
        <Avatar size={80} icon={<UserOutlined />}>
          {fullName.charAt(0)}
        </Avatar>
        <div>
          <S.OrthoTag $isOrtho={isOrthodontic}>
            {isOrthodontic ? 'Orthodontic' : 'Regular'}
          </S.OrthoTag>
          <S.BranchTag>{branchName}</S.BranchTag>
        </div>
      </S.AvatarSection>

      <Divider style={{ margin: '12px 0 16px' }} />

      {/* ── Info Grid ── */}
      <S.InfoGrid>
        <Row gutter={[16, 12]}>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <UserOutlined /> Full Name
              </S.InfoLabel>
              <S.InfoValue>{fullName}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <PhoneOutlined /> Contact
              </S.InfoLabel>
              <S.InfoValue>{phone}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <MailOutlined /> Email
              </S.InfoLabel>
              <S.InfoValue>{email}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <CalendarOutlined /> Birthdate
              </S.InfoLabel>
              <S.InfoValue>{birthDate}{age !== null ? ` (${age} years)` : ''}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>Gender</S.InfoLabel>
              <S.InfoValue>{gender}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <EnvironmentOutlined /> Address
              </S.InfoLabel>
              <S.InfoValue>{address}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>Notes</S.InfoLabel>
              <S.InfoValue>{notes}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24}>
            <S.InfoItem>
              <S.InfoLabel>Created At</S.InfoLabel>
              <S.InfoValue>{createdAt}</S.InfoValue>
            </S.InfoItem>
          </Col>
        </Row>
      </S.InfoGrid>
    </Modal>
  );
});

export default PatientDetailsModal;