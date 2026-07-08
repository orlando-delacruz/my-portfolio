// src/components/admin/Filter/Source/Source.jsx
import { memo } from 'react';
import { Select } from 'antd';
import { IoFilterOutline } from 'react-icons/io5';
import * as S from './Source.styled';

const { Option } = Select;

const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'online', label: 'Online' },
  { value: 'walk-in', label: 'Walk-in' },
];

const SourceFilter = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-source">Source</S.Label>
    <S.SelectWrapper>
      <S.IconLeft aria-hidden="true">
        <IoFilterOutline size={18} />
      </S.IconLeft>
      <S.StyledSelect
        id="filter-source"
        value={value}
        onChange={onChange}
        aria-label="Filter by source"
        popupMatchSelectWidth={false}
      >
        {SOURCE_OPTIONS.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </S.StyledSelect>
    </S.SelectWrapper>
  </S.Wrapper>
);

export default memo(SourceFilter);