// src/components/admin/Modal/UserDetailsModal/UserDetailsModal.jsx
import { memo } from 'react';
import { Modal, Avatar, Button, Divider, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined, MailOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { formatDate } from '../../../../utils/dateFormatter';
import * as S from './UserDetailsModal.styled';

const UserDetailsModal = memo(({
  open,
  user,
  onClose,
  onEdit,
  onDelete,
  loading,
}) => {
  if (!user) return null;

  const fullName = user.full_name || '—';
  const email = user.email || '—';
  const username = user.username || '—';
  const phone = user.phone_number || '—';
  const role = user.role || 'staff';
  const status = user.status || 'active';
  const loginMethod = user.login_method || 'password';
  const lastLogin = user.last_login_at ? formatDate(user.last_login_at) : 'Never';
  const avatarUrl = user.avatar_url || null;
  const createdAt = user.created_at ? formatDate(user.created_at) : '—';

  const statusColors = {
    active: { color: '#11D896', bg: 'rgba(17,216,150,0.15)' },
    inactive: { color: '#F81313', bg: 'rgba(248,19,19,0.15)' },
    pending: { color: '#F2B90F', bg: 'rgba(242,185,15,0.15)' },
  };

  const roleColors = {
    admin: { color: '#886217', bg: 'rgba(136,98,23,0.15)' },
    staff: { color: '#1976D2', bg: 'rgba(25,118,210,0.15)' },
    dentist: { color: '#B388FF', bg: 'rgba(179,136,255,0.15)' },
  };

  const statusColor = statusColors[status] || { color: '#686868', bg: 'rgba(104,104,104,0.1)' };
  const roleColor = roleColors[role] || { color: '#686868', bg: 'rgba(104,104,104,0.1)' };

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
            <S.UserName>{fullName}</S.UserName>
            <S.UserEmail>{email}</S.UserEmail>
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
            onEdit(user);
          }}
          loading={loading}
        >
          Edit User
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => {
            onClose();
            onDelete(user.id);
          }}
          loading={loading}
        >
          Delete User
        </Button>
      </S.ActionRow>

      {/* ── Avatar ── */}
      <S.AvatarSection>
        <Avatar size={80} src={avatarUrl} icon={<UserOutlined />}>
          {fullName.charAt(0)}
        </Avatar>
        <div>
          <S.RoleTag color={roleColor.color} bg={roleColor.bg}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </S.RoleTag>
          <S.StatusTag color={statusColor.color} bg={statusColor.bg}>
            <S.StatusDot color={statusColor.color} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </S.StatusTag>
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
                <MailOutlined /> Email
              </S.InfoLabel>
              <S.InfoValue>{email}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <UserOutlined /> Username
              </S.InfoLabel>
              <S.InfoValue>{username}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <PhoneOutlined /> Phone Number
              </S.InfoLabel>
              <S.InfoValue>{phone}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <ClockCircleOutlined /> Login Method
              </S.InfoLabel>
              <S.InfoValue>{loginMethod}</S.InfoValue>
            </S.InfoItem>
          </Col>
          <Col xs={24} sm={12}>
            <S.InfoItem>
              <S.InfoLabel>
                <ClockCircleOutlined /> Last Login
              </S.InfoLabel>
              <S.InfoValue>{lastLogin}</S.InfoValue>
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

export default UserDetailsModal;