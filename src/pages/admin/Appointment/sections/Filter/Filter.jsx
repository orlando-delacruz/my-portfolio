// src/pages/admin/Appointment/sections/Filter/Filter.jsx
import { memo, useMemo } from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import DateFilter from '../../../../../components/admin/Filter/Date/Date';
import Branch from '../../../../../components/admin/Filter/Branch/Branch';
import Status from '../../../../../components/admin/Filter/Status/Status';
import Search from '../../../../../components/admin/Filter/Search/Search';
import SourceFilter from '../../../../../components/admin/Filter/Source/Source'; // new component
import MobileFilterToggle from '../../../../../components/admin/Filter/MobileFilterToggle';
import { useMobileFilter } from '../../../../../hooks/useMobileFilter';
import * as S from './Filter.styled';

const Filter = ({ filters, onChange, onReset }) => {
  const { isMobile, isFilterOpen, toggleFilter, showFilters } = useMobileFilter();

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search?.trim()) count++;
    if (filters.branch && filters.branch !== 'all') count++;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1])) count++;
    if (filters.source && filters.source !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <>
      <MobileFilterToggle
        onClick={toggleFilter}
        isOpen={isFilterOpen}
        count={activeFilterCount}
      />

      {(showFilters || !isMobile) && (
        <S.FilterCard aria-label="Appointment filters">
          <DateFilter
            value={filters.dateRange}
            onChange={(val) => onChange('dateRange', val)}
          />
          <Branch
            value={filters.branch}
            onChange={(val) => onChange('branch', val)}
          />
          <Status
            value={filters.status}
            onChange={(val) => onChange('status', val)}
          />
          <SourceFilter
            value={filters.source}
            onChange={(val) => onChange('source', val)}
          />
          <Search
            value={filters.search}
            onChange={(val) => onChange('search', val)}
          />

          <S.ResetRow>
            <S.ResetButton type="button" onClick={onReset} aria-label="Reset all filters">
              <IoRefreshOutline aria-hidden="true" />
              Reset Filters
            </S.ResetButton>
          </S.ResetRow>
        </S.FilterCard>
      )}
    </>
  );
};

export default memo(Filter);