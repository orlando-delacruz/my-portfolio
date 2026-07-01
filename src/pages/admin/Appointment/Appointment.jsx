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

import { useAppointments } from "../../../hooks/useAppointments";
import { mapAppointmentRow } from "../../../utils/mapAppointmentRow";
import {
  adminUpdateAppointmentStatus,
  adminBulkDeleteAppointments,
} from "../../../services/appointments";
import { useAuthStore } from "../../../store/authStore";
import * as S from "./Appointment.styled";

const DEFAULT_PAGE_SIZE = 10;

const Appointment = () => {
  const { appointments: rawAppointments, loading, refetch } = useAppointments();
  const appointments = useMemo(
    () => rawAppointments.map(mapAppointmentRow),
    [rawAppointments]
  );

  const profile = useAuthStore((s) => s.profile);

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

  const {
    addOpen, addLoading, openAdd, closeAdd, handleAdd,
    rescheduleOpen, rescheduleLoading, rescheduleTarget,
    openReschedule, closeReschedule, handleReschedule,
  } = useAppointmentModal({
    onAddSuccess: () => refetch(),
    onRescheduleSuccess: () => refetch(),
  });

  const filtered = useMemo(() => {
    let result = [...appointments];

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
  }, [appointments, filters]);

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
        refetch();
      } catch (err) {
        console.error(err);
        message.error("Failed to update status. Please try again.");
      }
    },
    [profile, refetch]
  );

  const handleRescheduleById = useCallback(
    (id) => {
      const apt = appointments.find((a) => a.id === id);
      if (apt) openReschedule(apt);
    },
    [appointments, openReschedule]
  );

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // ── Bulk Delete ───────────────────────────────────────────────────────────
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
          // Keep selection on error
        } finally {
          setIsDeleting(false);
        }
      },
      onCancel() {
        // Just close modal, keep selection
      },
    });
  }, [selected, profile, refetch]);

  // ── Render selection toolbar ──────────────────────────────────────────────
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
        <Filter filters={filters} onChange={handleFilterChange} />
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
    </AdminLayout>
  );
};

export default memo(Appointment);