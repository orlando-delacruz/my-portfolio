// src/components/admin/Filter/ClosureType/ClosureType.jsx
import { memo } from 'react';
import { Select } from 'antd';
import { CLOSURE_TYPE_OPTIONS } from '../../../../data/admin/clinicClosures';
import * as S from './ClosureType.styled';

const { Option } = Select;

const ClosureType = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-closure-type">Closure Type</S.Label>
    <S.StyledSelect
      id="filter-closure-type"
      value={value}
      onChange={onChange}
      aria-label="Filter by closure type"
      popupMatchSelectWidth={false}
    >
      {CLOSURE_TYPE_OPTIONS.map((opt) => (
        <Option key={opt.value} value={opt.value}>
          {opt.label}
        </Option>
      ))}
    </S.StyledSelect>
  </S.Wrapper>
);

export default memo(ClosureType);