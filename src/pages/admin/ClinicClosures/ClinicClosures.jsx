// src/pages/admin/ClinicClosures/ClinicClosures.jsx
import { memo, useState, useCallback } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import PageTitle from './sections/PageTitle';
import Filter from './sections/Filter';
import ClosureTable from './sections/Table';
import { useClinicClosures } from './useClinicClosures';
import * as S from './ClinicClosures.styled';

const ClinicClosures = () => {
  const {
    closures,
    loading,
    pagination,
    filters,
    setFilters,
    setPage,
    setPageSize,
  } = useClinicClosures();

  const [selected, setSelected] = useState(new Set());

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

  const allSelected = closures.length > 0 && selected.size === closures.length;

  return (
    <AdminLayout>
      <S.PageContainer>
        <PageTitle onAdd={() => console.log('Add Closure clicked')} />
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
        />
      </S.PageContainer>
    </AdminLayout>
  );
};

export default memo(ClinicClosures);