// src/pages/admin/ClinicClosures/sections/Filter/Filter.jsx
import { memo } from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import Search from '../../../../../components/admin/Filter/Search/Search';
import Branch from '../../../../../components/admin/Filter/Branch/Branch';
import ClosureType from '../../../../../components/admin/Filter/ClosureType/ClosureType';
import ClosureStatus from '../../../../../components/admin/Filter/ClosureStatus/ClosureStatus';
import * as S from './Filter.styled';

const Filter = ({ filters, onChange, onReset }) => (
  <S.FilterCard aria-label="Clinic closure filters">
    <Search
      value={filters.search}
      onChange={(val) => onChange('search', val)}
    />
    <Branch
      value={filters.branch}
      onChange={(val) => onChange('branch', val)}
    />
    <ClosureType
      value={filters.closureType}
      onChange={(val) => onChange('closureType', val)}
    />
    <ClosureStatus
      value={filters.status}
      onChange={(val) => onChange('status', val)}
    />
    <S.ResetRow>
      <S.ResetButton type="button" onClick={onReset} aria-label="Reset all filters">
        <IoRefreshOutline aria-hidden="true" />
        Reset Filters
      </S.ResetButton>
    </S.ResetRow>
  </S.FilterCard>
);

export default memo(Filter);