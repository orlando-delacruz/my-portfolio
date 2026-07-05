// src/pages/admin/ClinicClosures/ClinicClosures.jsx
import { memo, useState, useCallback } from 'react';
import { Modal, message, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../../components/admin/AdminLayout';
import PageTitle from './sections/PageTitle';
import Filter from './sections/Filter';
import ClosureTable from './sections/Table';
import ClinicClosureModal from '../../../components/admin/Modal/ClinicClosureModal';
import ClinicClosureDetailsModal from '../../../components/admin/Modal/ClinicClosureDetailsModal';
import { useClinicClosures } from './useClinicClosures';
import { createClinicClosure, updateClinicClosure, deleteClinicClosure } from '../../../services/clinicClosures';
import * as S from './ClinicClosures.styled';

const { confirm } = Modal;

const ClinicClosures = () => {
  const {
    closures,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    setPageSize,
    refetch,
  } = useClinicClosures();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingClosure, setEditingClosure] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedClosure, setSelectedClosure] = useState(null);

  const handleAdd = useCallback(() => {
    setEditingClosure(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((closure) => {
    setEditingClosure(closure);
    setModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingClosure(null);
  }, []);

  const handleSave = useCallback(async (data) => {
    setModalLoading(true);
    try {
      if (editingClosure) {
        await updateClinicClosure(editingClosure.id, data);
        message.success('Closure updated successfully!');
      } else {
        await createClinicClosure(data);
        message.success('Closure created successfully!');
      }
      handleModalClose();
      refetch();
    } catch (err) {
      console.error('Save error:', err);
      message.error(err.message || 'Failed to save closure. Please try again.');
    } finally {
      setModalLoading(false);
    }
  }, [editingClosure, refetch, handleModalClose]);

  const handleDelete = useCallback((id) => {
    confirm({
      title: 'Delete Clinic Closure',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this closure? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteClinicClosure(id);
          message.success('Closure deleted successfully!');
          refetch();
          setSelected(new Set());
        } catch (err) {
          console.error('Delete error:', err);
          message.error(err.message || 'Failed to delete closure.');
        }
      },
    });
  }, [refetch]);

  const handleBulkDelete = useCallback(() => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    confirm({
      title: `Delete ${ids.length} Closure${ids.length > 1 ? 's' : ''}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete the selected closures? This action cannot be undone.',
      okText: `Delete ${ids.length}`,
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        for (const id of ids) {
          try {
            await deleteClinicClosure(id);
          } catch (err) {
            console.error('Bulk delete error:', err);
            message.error(`Failed to delete closure ${id}`);
          }
        }
        message.success(`${ids.length} closure(s) deleted.`);
        refetch();
        setSelected(new Set());
      },
    });
  }, [selected, refetch]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setSelected(new Set());
  }, [setFilters, setPage]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      search: '',
      branch: 'all',
      closureType: 'all',
      status: 'all',
    });
    setPage(1);
    setSelected(new Set());
  }, [setFilters, setPage]);

  const handleSelectAll = useCallback((checked) => {
    setSelected(checked ? new Set(closures.map((c) => c.id)) : new Set());
  }, [closures]);

  const handleSelectRow = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleRowClick = useCallback((closure) => {
    setSelectedClosure(closure);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedClosure(null);
  }, []);

  const allSelected = closures.length > 0 && selected.size === closures.length;

  if (loading && closures.length === 0) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spin size="large" description="Loading closures..." />
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
            <p>{error}</p>
            <button onClick={refetch} style={{ marginTop: 8, padding: '8px 16px', cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.PageContainer>
        <PageTitle onAdd={handleAdd} />
        <Filter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <ClosureTable
          closures={closures}
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
      <ClinicClosureModal
        open={modalOpen}
        closure={editingClosure}
        onClose={handleModalClose}
        onSave={handleSave}
        loading={modalLoading}
      />
      <ClinicClosureDetailsModal
        open={detailsModalOpen}
        closure={selectedClosure}
        onClose={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={modalLoading}
      />
    </AdminLayout>
  );
};

export default memo(ClinicClosures);