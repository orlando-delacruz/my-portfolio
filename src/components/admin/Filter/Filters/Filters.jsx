// src\components\admin\Filter\Filters\Filters.jsx
import { memo, useCallback } from "react";
import { Select } from "antd";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { CALENDAR_BRANCHES } from "../../../../constants/calendarConstants";
import * as S from "./Filters.styled";

const { Option } = Select;

/**
 * Toolbar filters: branch selector + a "Filters" toggle button reserved
 * for a future advanced-filter panel (status, date range, etc).
 *
 * @param {string}   branchId
 * @param {function} onBranchChange
 * @param {function} [onToggleFilters] — opens an advanced filter panel
 */
const Filters = ({ branchId, onBranchChange, onToggleFilters }) => {
  const handleBranchChange = useCallback(
    (val) => onBranchChange(val),
    [onBranchChange]
  );

  return (
    <S.FiltersRow>
      <S.BranchSelectWrapper>
        <Select
          value={branchId}
          onChange={handleBranchChange}
          aria-label="Filter calendar by branch"
          variant="borderless"
          style={{ minWidth: 140 }}
        >
          <Option value="">All Branches</Option>
          {CALENDAR_BRANCHES.map((b) => (
            <Option key={b.id} value={b.id}>
              {b.name}
            </Option>
          ))}
        </Select>
      </S.BranchSelectWrapper>

      <S.FilterToggleButton
        type="button"
        onClick={onToggleFilters}
        aria-label="Open additional filters"
      >
        <HiOutlineAdjustmentsHorizontal aria-hidden="true" />
        <span>Filters</span>
      </S.FilterToggleButton>
    </S.FiltersRow>
  );
};

export default memo(Filters);