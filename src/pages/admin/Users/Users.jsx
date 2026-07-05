// src/pages/admin/Users/Users.jsx
import { memo, useState, useCallback } from 'react';
import { Modal, message, Spin } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useUsers } from '../../../hooks/useUsers';
import UserTable from './sections/Table';
import UserModal from '../../../components/admin/Modal/UserModal';
import UserDetailsModal from '../../../components/admin/Modal/UserDetailsModal';
import { createAdminUser, updateAdmin, deleteAdmin } from '../../../services/admins';
import * as S from './Users.styled';

const { confirm } = Modal;

const Users = () => {
  const {
    users,
    loading,
    pagination,
    search,
    setSearch,
    setPage,
    setPageSize,
    refetch,
  } = useUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAdd = useCallback(() => {
    setEditingUser(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingUser(null);
  }, []);

  const handleSave = useCallback(async (data) => {
    setModalLoading(true);
    try {
      if (editingUser) {
        await updateAdmin(editingUser.id, data);
        message.success('User updated successfully!');
      } else {
        await createAdminUser(data);
        message.success('User created successfully!');
      }
      handleModalClose();
      refetch();
    } catch (err) {
      console.error('Save error:', err);
      message.error(err.message || 'Failed to save user. Please try again.');
    } finally {
      setModalLoading(false);
    }
  }, [editingUser, refetch, handleModalClose]);

  const handleDelete = useCallback((id) => {
    confirm({
      title: 'Delete User',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteAdmin(id);
          message.success('User deleted successfully!');
          refetch();
          setSelected(new Set());
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete user.');
        }
      },
    });
  }, [refetch]);

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} User${ids.length > 1 ? 's' : ''}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete the selected users? This action cannot be undone.',
      okText: `Delete ${ids.length}`,
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        for (const id of ids) {
          try {
            await deleteAdmin(id);
          } catch (err) {
            console.error('Bulk delete error:', err);
            message.error(`Failed to delete user ${id}`);
          }
        }
        message.success(`${ids.length} user(s) deleted.`);
        refetch();
        setSelected(new Set());
      },
    });
  }, [selected, refetch]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, [setSearch, setPage]);

  const handleSelectAll = useCallback((checked) => {
    setSelected(checked ? new Set(users.map((u) => u.id)) : new Set());
  }, [users]);

  const handleSelectRow = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleRowClick = useCallback((user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const allSelected = users.length > 0 && selected.size === users.length;

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spin size="large" description="Loading users..." />
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.PageContainer>
        <S.Header>
          <S.TitleGroup>
            <S.Title>Users</S.Title>
            <S.Subtitle>Manage administrator accounts</S.Subtitle>
          </S.TitleGroup>
          <S.HeaderActions>
            <S.SearchInput
              placeholder="Search users..."
              value={search}
              onChange={handleSearchChange}
              allowClear
              size="large"
            />
            <S.AddButton
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              size="large"
            >
              Add User
            </S.AddButton>
          </S.HeaderActions>
        </S.Header>

        <UserTable
          users={users}
          selected={selected}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          loading={loading}
          currentPage={pagination.page}
          totalEntries={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={setPage}
          onSizeChange={setPageSize}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={handleRowClick}
        />

        {selected.size > 0 && (
          <S.FloatingDeleteButton
            onClick={handleBulkDelete}
            danger
            icon={<ExclamationCircleOutlined />}
          >
            Delete {selected.size}
          </S.FloatingDeleteButton>
        )}
      </S.PageContainer>

      <UserModal
        open={modalOpen}
        user={editingUser}
        onClose={handleModalClose}
        onSave={handleSave}
        loading={modalLoading}
      />

      <UserDetailsModal
        open={detailsModalOpen}
        user={selectedUser}
        onClose={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default memo(Users);