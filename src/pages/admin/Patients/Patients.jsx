// src/pages/admin/Patients/Patients.jsx
import { memo, useState, useCallback, useMemo } from 'react';
import { Table, Input, Select, Button, Empty, message, Modal, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AdminLayout from '../../../components/admin/AdminLayout';
import { usePatients } from '../../../hooks/usePatients';
import EditPatientModal from '../../../components/admin/Modal/EditPatientModal';
import PatientDetailsModal from '../../../components/admin/Modal/PatientDetailsModal';
import { updatePatient, deletePatient, deletePatients } from '../../../services/patients';
import { formatPhoneDisplay } from '../../../utils/phoneFormatter';
import * as S from './Patients.styled';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const Patients = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);

  const {
    patients,
    loading,
    error,
    page,
    pageSize,
    search,
    filter,
    totalCount,
    setPage,
    setPageSize,
    setSearch,
    setFilter,
    refetch,
  } = usePatients({ initialPage: 1, initialPageSize: 10 });

  const handleEdit = useCallback((patient) => {
    setSelectedPatient(patient);
    setEditModalOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditModalOpen(false);
    setSelectedPatient(null);
  }, []);

  const handleSavePatient = useCallback(async (values) => {
    setUpdating(true);
    try {
      await updatePatient(selectedPatient.id, {
        first_name: values.firstName,
        middle_name: values.middleName || null,
        last_name: values.lastName,
        birth_date: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
        gender: values.gender || null,
        email: values.email || null,
        phone_number: values.phoneNumber,
        address: values.address || null,
        is_orthodontic: values.isOrthodontic || false,
        branch_id: values.branchId || null,
      });
      message.success('Patient updated successfully');
      setEditModalOpen(false);
      setSelectedPatient(null);
      refetch();
    } catch (err) {
      console.error('Update patient error:', err);
      message.error(err.message || 'Failed to update patient');
    } finally {
      setUpdating(false);
    }
  }, [selectedPatient, refetch]);

  const handleDeleteSingle = useCallback((patientId) => {
    confirm({
      title: 'Delete Patient',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this patient? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setDeletingId(patientId);
        try {
          await deletePatient(patientId);
          message.success('Patient deleted successfully');
          refetch();
        } catch (err) {
          console.error('Delete patient error:', err);
          message.error(err.message || 'Failed to delete patient');
        } finally {
          setDeletingId(null);
        }
      },
    });
  }, [refetch]);

  const handleBulkDelete = useCallback(() => {
    const count = selectedRowKeys.length;
    confirm({
      title: `Delete ${count} Patient${count > 1 ? 's' : ''}`,
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete the selected patients? This action cannot be undone.',
      okText: `Delete ${count}`,
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setBulkDeleting(true);
        try {
          await deletePatients(selectedRowKeys);
          message.success(`Successfully deleted ${count} patient${count > 1 ? 's' : ''}`);
          setSelectedRowKeys([]);
          refetch();
        } catch (err) {
          console.error('Bulk delete error:', err);
          message.error(err.message || 'Failed to delete patients');
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  }, [selectedRowKeys, refetch]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setPage(1);
  };

  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleRowClick = useCallback((record) => {
    setSelectedPatientForDetails(record);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedPatientForDetails(null);
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: deletingId === record.id,
    }),
  };

  const columns = useMemo(() => [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <span>
          {record.first_name} {record.middle_name ? record.middle_name + ' ' : ''}{record.last_name}
        </span>
      ),
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
    },
    {
      title: 'Phone',
      dataIndex: 'phone_number',
      key: 'phone',
      render: (phone) => phone ? formatPhoneDisplay(phone) : '—',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || '—',
    },
    {
      title: 'Branch',
      dataIndex: ['branch', 'name'],
      key: 'branch',
      render: (name) => name || '—',
    },
    {
      title: 'Orthodontic',
      dataIndex: 'is_orthodontic',
      key: 'ortho',
      render: (isOrtho) => (
        <S.OrthoBadge $isOrtho={isOrtho}>
          {isOrtho ? 'Yes' : 'No'}
        </S.OrthoBadge>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }} onClick={e => e.stopPropagation()}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
            style={{ color: '#886217' }}
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            loading={deletingId === record.id}
            onClick={() => handleDeleteSingle(record.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ], [handleEdit, handleDeleteSingle, deletingId]);

  const dataSource = patients.map((p) => ({ ...p, key: p.id }));

  if (loading && patients.length === 0) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spin size="large" description="Loading patients..." />
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#dc2626' }}>Error loading patients: {error}</p>
            <Button onClick={refetch} style={{ marginTop: 8 }}>Retry</Button>
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.PageContainer>
        <S.Header>
          <S.Title>Patient Management</S.Title>
        </S.Header>

        <S.FilterBar>
          <Search
            placeholder="Search patients..."
            value={search}
            onChange={handleSearchChange}
            allowClear
            prefix={<SearchOutlined style={{ color: '#aaa' }} />}
          />
          <Select
            value={filter}
            onChange={handleFilterChange}
            style={{ minWidth: 180 }}
          >
            <Option value="all">All Patients</Option>
            <Option value="ortho">Orthodontic Only</Option>
            <Option value="regular">Regular Only</Option>
          </Select>
        </S.FilterBar>

        <S.TableWrapper>
          <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' },
            })}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: totalCount,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
              showTotal: (total) => `Total ${total} patient${total > 1 ? 's' : ''}`,
            }}
            onChange={handleTableChange}
            rowKey="id"
            locale={{
              emptyText: <Empty description="No patients found" />,
            }}
            scroll={{ x: 700 }}
          />
        </S.TableWrapper>

        {selectedRowKeys.length > 0 && (
          <S.FloatingDeleteButton
            onClick={handleBulkDelete}
            loading={bulkDeleting}
            disabled={bulkDeleting}
            type="primary"
            danger
            icon={<DeleteOutlined />}
          >
            Delete {selectedRowKeys.length}
          </S.FloatingDeleteButton>
        )}

        <EditPatientModal
          open={editModalOpen}
          patient={selectedPatient}
          loading={updating}
          onClose={handleCloseEdit}
          onSave={handleSavePatient}
        />

        <PatientDetailsModal
          open={detailsModalOpen}
          patient={selectedPatientForDetails}
          onClose={handleCloseDetails}
          onEdit={handleEdit}
          onDelete={handleDeleteSingle}
          loading={deletingId ? true : false}
        />
      </S.PageContainer>
    </AdminLayout>
  );
};

export default memo(Patients);