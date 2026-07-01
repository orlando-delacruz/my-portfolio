// src/pages/admin/Appointment/Appointment.jsx
import { memo, useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { Modal, message } from "antd";
import { IoTrashBinOutline } from "react-icons/io5";

import AdminLayout from "../../../components/admin/AdminLayout";
import PageTitle from "./sections/PageTitle/PageTitle";
import Filter from "./sections/Filter/Filter";
import AppointmentTable from "./sections/Table/Table";
import {
  AddAppointmentModal,
  RescheduleModal,
  useAppointmentModal,
} from "../../../components/admin/Modal/AppointmentModal";
import AppointmentDetailsModal from "../../../components/admin/Modal/AppointmentDetailsModal";

import { useAppointments } from "../../../hooks/useAppointments";
import { mapAppointmentRow } from "../../../utils/mapAppointmentRow";
import {
  adminUpdateAppointmentStatus,
  adminBulkDeleteAppointments,
} from "../../../services/appointments";
import { useAuthStore } from "../../../store/authStore";
import * as S from "./Appointment.styled";

const DEFAULT_PAGE_SIZE = 10;

const STATUS_RANK = {
  pending: 1,
  confirmed: 2,
  completed: 3,
  cancelled: 4,
};

const getStatusRank = (status) => STATUS_RANK[status] ?? 99;

const Appointment = () => {
  const { appointments: rawAppointments, loading, refetch } = useAppointments();
  const profile = useAuthStore((s) => s.profile);

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

  const [filters, setFilters] = useState({
    dateRange: null,
    branch: "all",
    status: "all",
    search: "",
  });

  const [selected, setSelected] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Details Modal state ──
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const {
    addOpen, addLoading, openAdd, closeAdd, handleAdd,
    rescheduleOpen, rescheduleLoading, rescheduleTarget,
    openReschedule, closeReschedule, handleReschedule,
  } = useAppointmentModal({
    onAddSuccess: () => refetch(),
    onRescheduleSuccess: () => {
      refetch();
    },
  });

  const filtered = useMemo(() => {
    let result = [...sortedAppointments];

    if (filters.branch !== "all") {
      result = result.filter((apt) => apt.branch === filters.branch);
    }

    if (filters.status !== "all") {
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
        const d = dayjs(apt.date, "MMM D, YYYY");
        return (
          d.isValid() &&
          !d.isBefore(start, "day") &&
          !d.isAfter(end, "day")
        );
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
        // If details modal is open for this appointment, close it
        if (detailsModalOpen && selectedAppointmentId === id) {
          setDetailsModalOpen(false);
          setSelectedAppointmentId(null);
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to update status. Please try again.");
      }
    },
    [profile, refetch, detailsModalOpen, selectedAppointmentId]
  );

  const handleRescheduleById = useCallback(
    (id) => {
      const apt = sortedAppointments.find((a) => a.id === id);
      if (apt) {
        // Close details modal if open
        if (detailsModalOpen) {
          setDetailsModalOpen(false);
          setSelectedAppointmentId(null);
        }
        openReschedule(apt);
      }
    },
    [sortedAppointments, openReschedule, detailsModalOpen]
  );

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      dateRange: null,
      branch: "all",
      status: "all",
      search: "",
    });
    setSelected(new Set());
    setCurrentPage(1);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const count = selected.size;
    if (count === 0) return;

    Modal.confirm({
      title: "Delete Selected Appointments",
      content: (
        <div>
          <p>
            You are about to delete <strong>{count}</strong> appointment
            {count > 1 ? "s" : ""}.
          </p>
          <p style={{ color: "#dc2626", marginTop: 8 }}>
            This action cannot be undone.
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        setIsDeleting(true);
        try {
          await adminBulkDeleteAppointments(Array.from(selected), profile?.id);
          message.success(
            `Successfully deleted ${count} appointment${count > 1 ? "s" : ""}.`
          );
          await refetch();
          setSelected(new Set());
        } catch (err) {
          console.error("Bulk delete error:", err);
          message.error(
            err.message || "Failed to delete appointments. Please try again."
          );
        } finally {
          setIsDeleting(false);
        }
      },
      onCancel() { },
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

  const renderSelectionToolbar = () => {
    if (selected.size === 0) return null;

    return (
      <S.SelectionToolbar>
        <S.SelectionInfo>
          <span>{selected.size}</span> appointment{selected.size > 1 ? "s" : ""} selected
        </S.SelectionInfo>
        <S.DeleteButton
          onClick={handleDeleteSelected}
          disabled={isDeleting}
          $loading={isDeleting}
          aria-label="Delete selected appointments"
        >
          <IoTrashBinOutline aria-hidden="true" />
          {isDeleting ? "Deleting..." : "Delete Selected"}
        </S.DeleteButton>
      </S.SelectionToolbar>
    );
  };

  const allSelected =
    paginated.length > 0 && selected.size === paginated.length;

  return (
    <AdminLayout>
      <S.PageContainer>
        <PageTitle onAdd={openAdd} />
        <Filter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        {renderSelectionToolbar()}
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

      <AddAppointmentModal
        open={addOpen}
        loading={addLoading}
        onClose={closeAdd}
        onSubmit={handleAdd}
      />

      <RescheduleModal
        open={rescheduleOpen}
        loading={rescheduleLoading}
        appointment={rescheduleTarget}
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