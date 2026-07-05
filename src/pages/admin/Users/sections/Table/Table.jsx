// src/pages/admin/Users/sections/Table/Table.jsx
import { memo } from 'react';
import { Checkbox, Avatar, Dropdown, Tooltip } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import Pagination from '../../../../../components/admin/Pagination/Pagination';
import { formatDate } from '../../../../../utils/dateFormatter';
import * as S from './Table.styled';

// ── Status Badge ──
const StatusBadge = memo(({ status }) => {
  const config = {
    active: { color: '#11D896', bg: 'rgba(17,216,150,0.15)', label: 'Active' },
    inactive: { color: '#F81313', bg: 'rgba(248,19,19,0.15)', label: 'Inactive' },
    pending: { color: '#F2B90F', bg: 'rgba(242,185,15,0.15)', label: 'Pending' },
  };
  const cfg = config[status] || { color: '#686868', bg: 'rgba(104,104,104,0.1)', label: status };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = 'StatusBadge';

// ── Role Badge ──
const RoleBadge = memo(({ role }) => {
  const config = {
    admin: { color: '#886217', bg: 'rgba(136,98,23,0.15)', label: 'Admin' },
    staff: { color: '#1976D2', bg: 'rgba(25,118,210,0.15)', label: 'Staff' },
    dentist: { color: '#B388FF', bg: 'rgba(179,136,255,0.15)', label: 'Dentist' },
  };
  const cfg = config[role] || { color: '#686868', bg: 'rgba(104,104,104,0.1)', label: role };
  return (
    <S.RoleBadge $color={cfg.color} $bg={cfg.bg}>
      {cfg.label}
    </S.RoleBadge>
  );
});
RoleBadge.displayName = 'RoleBadge';

// ── Login Method Display ──
const LoginMethodIcon = memo(({ method }) => {
  const icons = {
    google: <span style={{ color: '#4285F4' }}>G</span>,
    password: <span>🔑</span>,
    magic_link: <span>✉️</span>,
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>{icons[method] || '🔑'} {method}</span>;
});
LoginMethodIcon.displayName = 'LoginMethodIcon';

// ── Actions Dropdown ──
const Actions = memo(({ user, onEdit, onDelete }) => {
  const items = [
    {
      key: 'edit',
      label: 'Edit User',
      icon: <EditOutlined />,
      onClick: () => onEdit(user),
    },
    {
      key: 'delete',
      label: 'Delete User',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(user.id),
    },
  ];

  // Stop event propagation to prevent row click when clicking dropdown
  const handleClick = (e) => e.stopPropagation();

  return (
    <div onClick={handleClick}>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <S.ActionButton type="text" size="small" icon={<MoreOutlined />} />
      </Dropdown>
    </div>
  );
});
Actions.displayName = 'Actions';

// ── Main Table ──
const UserTable = ({
  users,
  selected,
  allSelected,
  onSelectAll,
  onSelectRow,
  loading,
  currentPage,
  totalEntries,
  pageSize,
  onPageChange,
  onSizeChange,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const handleSelectAll = (e) => onSelectAll(e.target.checked);

  // Handle row click – ignore if clicking on checkbox, action buttons, or dropdown
  const handleRowClick = (e, user) => {
    // Ignore clicks on interactive elements
    const target = e.target;
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('button') ||
      target.closest('.ant-dropdown-trigger') ||
      target.closest('.ant-checkbox') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    onRowClick?.(user);
  };

  return (
    <S.TableCard>
      <S.ScrollWrapper>
        <S.StyledTable role="table" aria-label="Users">
          <S.THead>
            <S.TR>
              <S.TH $checkbox>
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.size > 0 && !allSelected}
                  onChange={handleSelectAll}
                />
              </S.TH>
              <S.TH>User</S.TH>
              <S.TH>Name & Role</S.TH>
              <S.TH>Email</S.TH>
              <S.TH>Login Method</S.TH>
              <S.TH>Status</S.TH>
              <S.TH>Last Login</S.TH>
              <S.TH $center>Actions</S.TH>
            </S.TR>
          </S.THead>

          <S.TBody>
            {loading ? (
              <S.TR>
                <S.TD colSpan={8} $center>
                  <S.LoadingText>Loading users…</S.LoadingText>
                </S.TD>
              </S.TR>
            ) : users.length === 0 ? (
              <S.TR>
                <S.TD colSpan={8} $center>
                  <S.EmptyText>
                    <UserOutlined style={{ fontSize: 32, color: '#ccc' }} />
                    <p>No users found</p>
                    <span style={{ fontSize: 12, color: '#888' }}>Try adjusting your search</span>
                  </S.EmptyText>
                </S.TD>
              </S.TR>
            ) : (
              users.map((user) => (
                <S.TR
                  key={user.id}
                  $selected={selected.has(user.id)}
                  onClick={(e) => handleRowClick(e, user)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  <S.TD $checkbox>
                    <Checkbox
                      checked={selected.has(user.id)}
                      onChange={() => onSelectRow(user.id)}
                    />
                  </S.TD>
                  <S.TD>
                    <Avatar src={user.avatar_url} size={44} icon={<UserOutlined />}>
                      {user.full_name?.charAt(0) || 'U'}
                    </Avatar>
                  </S.TD>
                  <S.TD>
                    <S.NameCell>
                      <span style={{ fontWeight: 500 }}>{user.full_name || '—'}</span>
                      <RoleBadge role={user.role} />
                    </S.NameCell>
                  </S.TD>
                  <S.TD>
                    <Tooltip title={user.email} placement="top">
                      <span style={{ display: 'inline-block', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user.email}
                      </span>
                    </Tooltip>
                  </S.TD>
                  <S.TD>
                    <LoginMethodIcon method={user.login_method} />
                  </S.TD>
                  <S.TD><StatusBadge status={user.status} /></S.TD>
                  <S.TD>
                    {user.last_login_at ? (
                      <div>
                        <div style={{ fontWeight: 500 }}>{formatDate(user.last_login_at)}</div>
                        <div style={{ fontSize: '11px', color: '#999' }}>
                          {new Date(user.last_login_at).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>Never</span>
                    )}
                  </S.TD>
                  <S.TD $center>
                    <Actions
                      user={user}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onRowClick={onRowClick}
                    />
                  </S.TD>
                </S.TR>
              ))
            )}
          </S.TBody>
        </S.StyledTable>
      </S.ScrollWrapper>

      <S.PaginationWrapper>
        <Pagination
          currentPage={currentPage}
          totalEntries={totalEntries}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onSizeChange={onSizeChange}
        />
      </S.PaginationWrapper>
    </S.TableCard>
  );
};

export default memo(UserTable);