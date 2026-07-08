// src/pages/admin/Users/Users.jsx
import { memo, useState, useCallback } from "react";
import { Modal, message, Spin } from "antd";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/admin/AdminLayout";
import { useUsers } from "../../../hooks/useUsers";
import UserTable from "./sections/Table";
import UserModal from "../../../components/admin/Modal/UserModal";
import UserDetailsModal from "../../../components/admin/Modal/UserDetailsModal";
import { createAdmin, updateAdmin, deleteAdmin } from "../../../services/admins";
import * as S from "./Users.styled";

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

  // ── Open Add modal ──
  const handleAdd = useCallback(() => {
    setEditingUser(null);
    setModalOpen(true);
  }, []);

  // ── Open Edit modal ──
  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setModalOpen(true);
  }, []);

  // ── Close modal ──
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingUser(null);
  }, []);

  // ── Save (create or update) ──
  const handleSave = useCallback(async (data) => {
    setModalLoading(true);
    try {
      if (editingUser) {
        await updateAdmin(editingUser.id, data);
        message.success("User updated successfully!");
      } else {
        await createAdmin(data);
        message.success("User created successfully!");
      }
      handleModalClose();
      refetch();
    } catch (err) {
      console.error("Save error:", err);
      message.error(err.message || "Failed to save user. Please try again.");
    } finally {
      setModalLoading(false);
    }
  }, [editingUser, refetch, handleModalClose]);

  // ── Permanent delete (hard delete) ──
  const handleDelete = useCallback((id) => {
    confirm({
      title: "Permanently Delete Administrator",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This action <strong>cannot be undone</strong>.</p>
          <p>The administrator account, authentication credentials, and all associated logs will be <strong>permanently deleted</strong>.</p>
          <p>Business data (appointments, patients, branches, etc.) will remain intact.</p>
        </div>
      ),
      okText: "Yes, Delete Permanently",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const user = users.find((u) => u.id === id);
          await deleteAdmin(id, user?.auth_user_id);
          message.success("Administrator deleted permanently.");
          refetch();
          setSelected(new Set());
        } catch (err) {
          console.error("Deletion error:", err);
          message.error(err.message || "Failed to delete administrator.");
        }
      },
    });
  }, [users, refetch]);

  // ── Bulk delete ──
  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    confirm({
      title: `Permanently Delete ${ids.length} Administrator${ids.length > 1 ? 's' : ''}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This action <strong>cannot be undone</strong>.</p>
          <p>All selected administrator accounts, authentication credentials, and associated logs will be <strong>permanently deleted</strong>.</p>
          <p>Business data (appointments, patients, branches, etc.) will remain intact.</p>
        </div>
      ),
      okText: `Delete ${ids.length}`,
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        for (const id of ids) {
          try {
            const user = users.find((u) => u.id === id);
            await deleteAdmin(id, user?.auth_user_id);
          } catch (err) {
            console.error("Bulk deletion error:", err);
            message.error(`Failed to delete user ${id}`);
          }
        }
        message.success(`${ids.length} administrator(s) deleted permanently.`);
        refetch();
        setSelected(new Set());
      },
    });
  }, [selected, users, refetch]);

  // ── Search ──
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, [setSearch, setPage]);

  // ── Table selection ──
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

  // ── Row click → open details modal ──
  const handleRowClick = useCallback((user) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const allSelected = users.length > 0 && selected.size === users.length;

  // ── Page‑level loading ──
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