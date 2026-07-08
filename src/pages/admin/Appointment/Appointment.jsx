// src/pages/admin/Appointment/Appointment.jsx
import { memo, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Modal, message, Spin } from 'antd';
import { IoTrashBinOutline } from 'react-icons/io5';

import AdminLayout from '../../../components/admin/AdminLayout';
import PageTitle from './sections/PageTitle/PageTitle';
import Filter from './sections/Filter/Filter';
import AppointmentTable from './sections/Table/Table';
import {
  AddAppointmentModal,
  RescheduleModal,
  useAppointmentModal,
} from '../../../components/admin/Modal/AppointmentModal';
import AppointmentDetailsModal from '../../../components/admin/Modal/AppointmentDetailsModal';

import { useAppointments } from '../../../hooks/useAppointments';
import { mapAppointmentRow } from '../../../utils/mapAppointmentRow';
import {
  adminUpdateAppointmentStatus,
  adminBulkDeleteAppointments,
} from '../../../services/appointments';
import { useAuthStore } from '../../../store/authStore';
import * as S from './Appointment.styled';

const DEFAULT_PAGE_SIZE = 10;

const STATUS_RANK = {
  pending: 1,
  confirmed: 2,
  completed: 3,
  cancelled: 4,
};

const getStatusRank = (status) => STATUS_RANK[status] ?? 99;

const Appointment = () => {
  const profile = useAuthStore((s) => s.profile);
  const [searchParams] = useSearchParams();

  // ── Parse URL parameters ──
  const initialFilters = useMemo(() => {
    const filters = {
      dateRange: null,
      branch: 'all',
      status: 'all',
      search: '',
      source: 'all',
    };
    const dateParam = searchParams.get('date');
    const statusParam = searchParams.get('status');
    const typeParam = searchParams.get('type');

    // Date
    if (dateParam === 'today') {
      const today = dayjs().startOf('day');
      filters.dateRange = [today, today];
    } else if (dateParam === 'upcoming') {
      const tomorrow = dayjs().add(1, 'day').startOf('day');
      filters.dateRange = [tomorrow, null];
    }

    // Status
    if (statusParam && ['pending', 'confirmed', 'completed', 'cancelled'].includes(statusParam)) {
      filters.status = statusParam;
    }

    // Source (walk-in / online)
    if (typeParam === 'walkin') {
      filters.source = 'walk-in';
    } else if (typeParam === 'online') {
      filters.source = 'online';
    }

    return { filters };
  }, [searchParams]);

  const [filters, setFilters] = useState(initialFilters.filters);

  // ── Fetch appointments (no status filter; we apply status filter client-side) ──
  const { appointments: rawAppointments, loading, refetch } = useAppointments(
    filters.source === 'all' ? null : filters.source,
    false // never exclude cancelled by default
  );

  const mappedAppointments = useMemo(
    () => rawAppointments.map(mapAppointmentRow),
    [rawAppointments]
  );

  const sortedAppointments = useMemo(() => {
    return [...mappedAppointments].sort((a, b) => {
      const rankA = getStatusRank(a.status);
      const rankB = getStatusRank(b.status);
      if (rankA !== rankB) return rankA - rankB;
      if (a.rawDate < b.rawDate) return -1;
      if (a.rawDate > b.rawDate) return 1;
      if (a.rawTime < b.rawTime) return -1;
      if (a.rawTime > b.rawTime) return 1;
      return (a.createdAt || '').localeCompare(b.createdAt || '');
    });
  }, [mappedAppointments]);

  const [selected, setSelected] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDeleting, setIsDeleting] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const {
    addOpen, addLoading, openAdd, closeAdd, handleAdd,
    rescheduleOpen, rescheduleLoading, rescheduleTargetId,
    openReschedule, closeReschedule, handleReschedule,
  } = useAppointmentModal({
    onAddSuccess: () => refetch(),
    onRescheduleSuccess: () => refetch(),
  });

  // ── Apply frontend filters (branch, status, date, search) ──
  const filtered = useMemo(() => {
    let result = [...sortedAppointments];

    if (filters.branch !== 'all') {
      result = result.filter((apt) => apt.branch === filters.branch);
    }

    if (filters.status !== 'all') {
      result = result.filter((apt) => apt.status === filters.status);
    }

    const q = filters.search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(q) ||
          apt.contactNumber.includes(q) ||
          apt.referenceNo.toLowerCase().includes(q) ||
          apt.reason?.toLowerCase().includes(q)
      );
    }

    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      const [start, end] = filters.dateRange;
      result = result.filter((apt) => {
        const d = dayjs(apt.date, 'MMM D, YYYY');
        return (
          d.isValid() &&
          !d.isBefore(start, 'day') &&
          !d.isAfter(end, 'day')
        );
      });
    } else if (filters.dateRange?.[0] && !filters.dateRange?.[1]) {
      // Only start date provided: filter from that date onwards
      const start = filters.dateRange[0];
      result = result.filter((apt) => {
        const d = dayjs(apt.date, 'MMM D, YYYY');
        return d.isValid() && !d.isBefore(start, 'day');
      });
    }

    return result;
  }, [sortedAppointments, filters]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelected(new Set());
    setCurrentPage(1);
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      setSelected(
        checked ? new Set(paginated.map((a) => a.id)) : new Set()
      );
    },
    [paginated]
  );

  const handleSelectRow = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleSetStatus = useCallback(
    async (id, newStatus) => {
      try {
        await adminUpdateAppointmentStatus({
          appointmentId: id,
          status: newStatus,
          adminId: profile?.id,
        });
        message.success(`Status updated to ${newStatus}.`);
        await refetch();
        if (detailsModalOpen && selectedAppointmentId === id) {
          setDetailsModalOpen(false);
          setSelectedAppointmentId(null);
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to update status. Please try again.');
      }
    },
    [profile, refetch, detailsModalOpen, selectedAppointmentId]
  );

  const handleRescheduleById = useCallback(
    (id) => {
      if (detailsModalOpen) {
        setDetailsModalOpen(false);
        setSelectedAppointmentId(null);
      }
      openReschedule(id);
    },
    [openReschedule, detailsModalOpen]
  );

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      dateRange: null,
      branch: 'all',
      status: 'all',
      search: '',
      source: 'all',
    });
    setSelected(new Set());
    setCurrentPage(1);
  }, []);

  const handleBulkDelete = useCallback(() => {
    const count = selected.size;
    if (count === 0) return;

    Modal.confirm({
      title: `Delete ${count} Appointment${count > 1 ? 's' : ''}`,
      content: 'Are you sure you want to delete the selected appointments? This action cannot be undone.',
      okText: `Delete ${count}`,
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsDeleting(true);
        try {
          await adminBulkDeleteAppointments(Array.from(selected), profile?.id);
          message.success(`Successfully deleted ${count} appointment${count > 1 ? 's' : ''}.`);
          await refetch();
          setSelected(new Set());
        } catch (err) {
          console.error('Bulk delete error:', err);
          message.error(
            err.message || 'Failed to delete appointments. Please try again.'
          );
        } finally {
          setIsDeleting(false);
        }
      },
    });
  }, [selected, profile, refetch]);

  const handleRowClick = useCallback((appointment) => {
    setSelectedAppointmentId(appointment.id);
    setDetailsModalOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setDetailsModalOpen(false);
    setSelectedAppointmentId(null);
  }, []);

  const allSelected =
    paginated.length > 0 && selected.size === paginated.length;

  const hasSelected = selected.size > 0;
  const selectedCount = selected.size;

  if (loading && rawAppointments.length === 0) {
    return (
      <AdminLayout>
        <S.PageContainer>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <Spin size="large" description="Loading appointments..." />
          </div>
        </S.PageContainer>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <S.PageContainer>
        <PageTitle onAdd={openAdd} />
        <Filter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <AppointmentTable
          appointments={paginated}
          selected={selected}
          allSelected={allSelected}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          onSetStatus={handleSetStatus}
          onReschedule={handleRescheduleById}
          currentPage={currentPage}
          totalEntries={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onSizeChange={handlePageSizeChange}
          loading={loading}
          onRowClick={handleRowClick}
        />
      </S.PageContainer>

      {hasSelected && (
        <S.FloatingDeleteButton
          onClick={handleBulkDelete}
          loading={isDeleting}
          disabled={isDeleting}
          danger
          icon={<IoTrashBinOutline />}
        >
          Delete {selectedCount}
        </S.FloatingDeleteButton>
      )}

      <AddAppointmentModal
        open={addOpen}
        loading={addLoading}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />

      <RescheduleModal
        open={rescheduleOpen}
        appointmentId={rescheduleTargetId}
        loading={rescheduleLoading}
        onClose={closeReschedule}
        onSubmit={handleReschedule}
      />

      <AppointmentDetailsModal
        open={detailsModalOpen}
        appointmentId={selectedAppointmentId}
        onClose={handleCloseDetails}
        onSetStatus={handleSetStatus}
        onReschedule={handleRescheduleById}
      />
    </AdminLayout>
  );
};

export default memo(Appointment);