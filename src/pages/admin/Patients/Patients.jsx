// src/pages/admin/Patients/Patients.jsx
import { memo, useState, useCallback } from 'react';
import { Spin, message } from 'antd';
import AdminLayout from '../../../components/admin/AdminLayout';
import { usePatients } from '../../../hooks/usePatients';
import EditPatientModal from '../../../components/admin/Modal/EditPatientModal';
import { updatePatient } from '../../../services/patients';
import Pagination from '../../../components/admin/Pagination';
import * as S from './Patients.styled';

const Patients = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [updating, setUpdating] = useState(false);

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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(1);
  };

  if (error) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ color: '#dc2626', textAlign: 'center', padding: '40px' }}>
            <p>Error loading patients: {error}</p>
            <button onClick={refetch} style={{ marginTop: 8, cursor: 'pointer', padding: '8px 16px' }}>
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
        <S.Header>
          <S.Title>Patients</S.Title>
        </S.Header>

        <S.Filters>
          <S.SearchInput
            type="text"
            placeholder="Search by name, phone, email..."
            value={search}
            onChange={handleSearchChange}
          />
          <S.FilterSelect value={filter} onChange={handleFilterChange}>
            <option value="all">All Patients</option>
            <option value="ortho">Orthodontic Only</option>
            <option value="regular">Regular Only</option>
          </S.FilterSelect>
        </S.Filters>

        <S.TableWrapper>
          <S.Table>
            <S.Thead>
              <tr>
                <S.Th>Name</S.Th>
                <S.Th>Phone</S.Th>
                <S.Th>Email</S.Th>
                <S.Th>Branch</S.Th>
                <S.Th>Orthodontic</S.Th>
                <S.Th>Actions</S.Th>
              </tr>
            </S.Thead>
            <tbody>
              {loading ? (
                <S.EmptyRow>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin size="large" />
                  </td>
                </S.EmptyRow>
              ) : patients.length === 0 ? (
                <S.EmptyRow>
                  <td colSpan="6">No patients found.</td>
                </S.EmptyRow>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <S.Td>
                      {patient.first_name} {patient.middle_name ? patient.middle_name + ' ' : ''}{patient.last_name}
                    </S.Td>
                    <S.Td>{patient.phone_number || '—'}</S.Td>
                    <S.Td>{patient.email || '—'}</S.Td>
                    <S.Td>{patient.branch?.name || '—'}</S.Td>
                    <S.Td>
                      <S.OrthoBadge $isOrtho={patient.is_orthodontic}>
                        {patient.is_orthodontic ? 'Yes' : 'No'}
                      </S.OrthoBadge>
                    </S.Td>
                    <S.Td>
                      <S.EditButton onClick={() => handleEdit(patient)}>Edit</S.EditButton>
                    </S.Td>
                  </tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>

        <S.PaginationWrapper>
          <span style={{ fontSize: '14px', color: '#555' }}>
            {totalCount} patient{totalCount !== 1 ? 's' : ''}
          </span>
          <Pagination
            currentPage={page}
            totalEntries={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onSizeChange={handlePageSizeChange}
          />
        </S.PaginationWrapper>

        <EditPatientModal
          open={editModalOpen}
          patient={selectedPatient}
          loading={updating}
          onClose={handleCloseEdit}
          onSave={handleSavePatient}
        />
      </S.PageContainer>
    </AdminLayout>
  );
};

export default memo(Patients);