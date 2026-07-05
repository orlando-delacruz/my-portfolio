// src/components/admin/Filter/ClosureStatus/ClosureStatus.jsx
import { memo } from 'react';
import { Select } from 'antd';
import { CLOSURE_STATUS_OPTIONS } from '../../../../data/admin/clinicClosures';
import * as S from './ClosureStatus.styled';

const { Option } = Select;

const ClosureStatus = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-closure-status">Status</S.Label>
    <S.StyledSelect
      id="filter-closure-status"
      value={value}
      onChange={onChange}
      aria-label="Filter by closure status"
      popupMatchSelectWidth={false}
    >
      {CLOSURE_STATUS_OPTIONS.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </S.StyledSelect>
  </S.Wrapper>
);

export default memo(ClosureStatus);