// src/components/admin/Filter/Filters/Filters.jsx
import { memo, useCallback } from 'react';
import { Select } from 'antd';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useBranches } from '../../../../hooks/useBranches';
import * as S from './Filters.styled';

const { Option } = Select;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const Filters = memo(({
  branchId,
  onBranchChange,
  status,
  onStatusChange,
  onToggleFilters, // optional, for mobile
}) => {
  const { branches, loading: branchesLoading } = useBranches();

  const handleBranchChange = useCallback(
    (val) => {
      console.log('🔄 Branch filter changed to:', val);
      onBranchChange(val);
    },
    [onBranchChange]
  );

  const handleStatusChange = useCallback(
    (val) => {
      console.log('🔄 Status filter changed to:', val);
      onStatusChange(val);
    },
    [onStatusChange]
  );

  return (
    <S.FiltersRow>
      <S.BranchSelectWrapper>
        <Select
          value={branchId || ''}
          onChange={handleBranchChange}
          aria-label="Filter by branch"
          variant="borderless"
          style={{ minWidth: 140 }}
          loading={branchesLoading}
        >
          <Option value="">All Branches</Option>
          {branches.map((b) => (
            <Option key={b.id} value={b.id}>
              {b.name}
            </Option>
          ))}
        </Select>
      </S.BranchSelectWrapper>

      <S.BranchSelectWrapper>
        <Select
          value={status || 'all'}
          onChange={handleStatusChange}
          aria-label="Filter by appointment status"
          variant="borderless"
          style={{ minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </S.BranchSelectWrapper>

      {onToggleFilters && (
        <S.FilterToggleButton
          type="button"
          onClick={onToggleFilters}
          aria-label="Open additional filters"
        >
          <HiOutlineAdjustmentsHorizontal aria-hidden="true" />
          <span>Filters</span>
        </S.FilterToggleButton>
      )}
    </S.FiltersRow>
  );
});

Filters.displayName = 'Filters';
export default Filters;