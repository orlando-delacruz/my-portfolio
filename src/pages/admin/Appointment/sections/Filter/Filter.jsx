// src/pages/admin/Appointment/sections/Filter/Filter.jsx
import { memo } from "react";
import { IoRefreshOutline } from "react-icons/io5";
import DateFilter from "../../../../../components/admin/Filter/Date/Date";
import Branch from "../../../../../components/admin/Filter/Branch/Branch";
import Status from "../../../../../components/admin/Filter/Status/Status";
import Search from "../../../../../components/admin/Filter/Search/Search";
import * as S from "./Filter.styled";

/**
 * Sidebar filter panel for Appointments.
 * @param {object}   filters   — { dateRange, branch, status, search }
 * @param {function} onChange  — (key, value) => void
 * @param {function} onReset   — () => void
 */
const Filter = ({ filters, onChange, onReset }) => (
  <S.FilterCard aria-label="Appointment filters">
    <DateFilter
      value={filters.dateRange}
      onChange={(val) => onChange("dateRange", val)}
    />
    <Branch
      value={filters.branch}
      onChange={(val) => onChange("branch", val)}
    />
    <Status
      value={filters.status}
      onChange={(val) => onChange("status", val)}
    />
    <Search
      value={filters.search}
      onChange={(val) => onChange("search", val)}
    />

    {/* Reset button row - spans full width */}
    <S.ResetRow>
      <S.ResetButton type="button" onClick={onReset} aria-label="Reset all filters">
        <IoRefreshOutline aria-hidden="true" />
        Reset Filters
      </S.ResetButton>
    </S.ResetRow>
  </S.FilterCard>
);

export default memo(Filter);