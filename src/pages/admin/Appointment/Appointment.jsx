import { memo, useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { message } from "antd";

import AdminLayout from "../../../components/admin/AdminLayout";
import PageTitle from "./sections/PageTitle/PageTitle";
import Filter from "./sections/Filter/Filter";
import AppointmentTable from "./sections/Table/Table";
import {
  AddAppointmentModal,
  RescheduleModal,
  useAppointmentModal,
} from "../../../components/admin/Modal/AppointmentModal";

import appointmentsData from "../../../data/admin/appointment";
import * as S from "./Appointment.styled";

const DEFAULT_PAGE_SIZE = 10;

const Appointment = () => {
  const [appointments, setAppointments] = useState(appointmentsData);

  const [filters, setFilters] = useState({
    dateRange: null,
    branch: "all",
    status: "all",
    search: "",
  });

  const [selected, setSelected] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const handleResetFilters = useCallback(() => {
    setFilters({
      dateRange: null,
      branch: "all",
      status: "all",
      search: "",
    });
    setSelected(new Set());
    setCurrentPage(1);
  }, [setSelected, setCurrentPage]);

  const {
    addOpen,
    addLoading,
    openAdd,
    closeAdd,
    handleAdd,
    rescheduleOpen,
    rescheduleLoading,
    rescheduleTarget,
    openReschedule,
    closeReschedule,
    handleReschedule,
  } = useAppointmentModal({
    onAddSuccess: (newRecord) => {
      setAppointments((prev) => [newRecord, ...prev]);
    },
    onRescheduleSuccess: (updated) => {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === updated.id ? updated : apt))
      );
    },
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
          apt.reason.toLowerCase().includes(q)
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
  }, [setFilters, setSelected, setCurrentPage]);

  const handleSelectAll = useCallback(
    (checked) => {
      setSelected(
        checked ? new Set(paginated.map((a) => a.id)) : new Set()
      );
    },
    [paginated, setSelected]
  );

  const handleSelectRow = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, [setSelected]);

  const handleSetStatus = useCallback((id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    message.success(`Status updated to ${newStatus}.`);
  }, [setAppointments]);

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
  }, [setPageSize, setCurrentPage]);

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
          loading={false}
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