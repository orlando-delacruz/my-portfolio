// src/pages/admin/Appointment/sections/Table/Table.jsx
import { memo, useCallback } from "react";
import { Checkbox, Dropdown } from "antd";
import {
  IoSettingsOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import Pagination from "../../../../../components/admin/Pagination/Pagination";
import {
  STATUS_CONFIG,
  TABLE_COLUMNS,
} from "../../../../../data/admin/appointment";
import { formatPhoneDisplay } from "../../../../../utils/phoneFormatter";
import * as S from "./Table.styled";

// ── Sub-components ────────────────────────────────────────────────────────────
const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "#686868",
    bg: "rgba(104,104,104,0.2)",
  };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} aria-hidden="true" />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = "StatusBadge";

const BRANCH_COLOR_MAP = {
  "san juan branch": {
    color: "#E963C8",
    bg: "rgba(233,99,200,0.2)",
    border: "rgba(233,99,200,0.5)",
  },
  "rosario branch": {
    color: "#B388FF",
    bg: "rgba(179,136,255,0.2)",
    border: "rgba(179,136,255,0.5)",
  },
};

const DEFAULT_BRANCH_COLOR = {
  color: "#686868",
  bg: "rgba(104,104,104,0.2)",
  border: "rgba(104,104,104,0.5)",
};

const BranchBadge = memo(({ branchName }) => {
  const cfg =
    BRANCH_COLOR_MAP[branchName?.toLowerCase()] ?? DEFAULT_BRANCH_COLOR;
  return (
    <S.BranchBadge $color={cfg.color} $bg={cfg.bg} $border={cfg.border}>
      {branchName ?? "—"}
    </S.BranchBadge>
  );
});
BranchBadge.displayName = "BranchBadge";

const ActionButtons = memo(({ appointment, onSetStatus, onReschedule }) => {
  const statusItems = [
    { key: "completed", label: "Completed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const menuProps = {
    items: statusItems.map((s) => ({
      key: s.key,
      label: s.label,
      onClick: () => onSetStatus(appointment.id, s.key),
    })),
  };

  return (
    <S.Actions>
      <Dropdown menu={menuProps} trigger={["click"]}>
        <S.ActionBtn $variant="primary" aria-label="Set appointment status">
          <IoSettingsOutline size={18} color="#ffffff" aria-hidden="true" />
          <span>Set Status</span>
        </S.ActionBtn>
      </Dropdown>

      <S.ActionBtn
        $variant="secondary"
        onClick={() => onReschedule(appointment.id)}
        aria-label="Reschedule appointment"
      >
        <IoCalendarOutline size={18} color="#222222" aria-hidden="true" />
        <span>Reschedule</span>
      </S.ActionBtn>
    </S.Actions>
  );
});
ActionButtons.displayName = "ActionButtons";

// ── Main Table ────────────────────────────────────────────────────────────────
const AppointmentTable = ({
  appointments,
  selected,
  allSelected,
  onSelectAll,
  onSelectRow,
  onSetStatus,
  onReschedule,
  currentPage,
  totalEntries,
  pageSize,
  onPageChange,
  onSizeChange,
  loading,
  onRowClick,
}) => {
  const handleSelectAll = useCallback(
    (e) => onSelectAll(e.target.checked),
    [onSelectAll]
  );

  const handleRowClick = useCallback(
    (e, appointment) => {
      const target = e.target;
      if (
        target.closest('input[type="checkbox"]') ||
        target.closest('button') ||
        target.closest('.ant-dropdown-trigger') ||
        target.closest('.ant-checkbox') ||
        target.closest('[role="button"]')
      ) {
        return;
      }
      onRowClick?.(appointment);
    },
    [onRowClick]
  );

  return (
    <S.TableCard>
      <S.ScrollWrapper>
        <S.StyledTable role="table" aria-label="Appointments">
          {/* ── Head ── */}
          <S.THead>
            <S.TR>
              <S.TH $checkbox>
                <Checkbox
                  checked={allSelected}
                  indeterminate={selected.size > 0 && !allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all appointments"
                />
              </S.TH>
              {TABLE_COLUMNS.map((col) => (
                <S.TH key={col.key} $center={col.center} scope="col">
                  {col.label}
                </S.TH>
              ))}
            </S.TR>
          </S.THead>

          {/* ── Body ── */}
          <S.TBody>
            {loading ? (
              <S.TR>
                <S.TD colSpan={TABLE_COLUMNS.length + 1} $center>
                  <S.LoadingText>Loading appointments…</S.LoadingText>
                </S.TD>
              </S.TR>
            ) : appointments.length === 0 ? (
              <S.TR>
                <S.TD colSpan={TABLE_COLUMNS.length + 1} $center>
                  <S.EmptyText>No appointments found.</S.EmptyText>
                </S.TD>
              </S.TR>
            ) : (
              appointments.map((apt) => (
                <S.TR
                  key={apt.id}
                  $selected={selected.has(apt.id)}
                  onClick={(e) => handleRowClick(e, apt)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  <S.TD $checkbox>
                    <Checkbox
                      checked={selected.has(apt.id)}
                      onChange={() => onSelectRow(apt.id)}
                      aria-label={`Select appointment ${apt.referenceNo}`}
                    />
                  </S.TD>
                  <S.TD>{apt.referenceNo}</S.TD>
                  <S.TD>{apt.patientName}</S.TD>
                  <S.TD>{formatPhoneDisplay(apt.contactNumber)}</S.TD>  {/* ✅ Format phone */}
                  <S.TD>
                    <BranchBadge branchName={apt.branchName} />
                  </S.TD>
                  <S.TD>{apt.date}</S.TD>
                  <S.TD>{apt.time}</S.TD>
                  <S.TD>{apt.reason}</S.TD>
                  <S.TD>
                    <StatusBadge status={apt.status} />
                  </S.TD>
                  <S.TD $center>
                    <ActionButtons
                      appointment={apt}
                      onSetStatus={onSetStatus}
                      onReschedule={onReschedule}
                    />
                  </S.TD>
                </S.TR>
              ))
            )}
          </S.TBody>
        </S.StyledTable>
      </S.ScrollWrapper>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalEntries={totalEntries}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onSizeChange={onSizeChange}
      />
    </S.TableCard>
  );
};

export default memo(AppointmentTable);