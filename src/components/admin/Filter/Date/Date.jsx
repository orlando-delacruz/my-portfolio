// src/components/admin/Filter/Date/Date.jsx
import { memo } from 'react';
import { DatePicker } from 'antd';
import { IoCalendarOutline } from 'react-icons/io5';
import * as S from './Date.styled';

const DateFilter = ({ value, onChange }) => {
  // value is an array [startDayjs, endDayjs] or null
  const handleStartChange = (date) => {
    const end = value?.[1] || null;
    onChange(date ? [date, end] : null);
  };

  const handleEndChange = (date) => {
    const start = value?.[0] || null;
    onChange(start ? [start, date] : null);
  };

  return (
    <S.Wrapper>
      <S.Label htmlFor="filter-date">Date</S.Label>
      <S.PickerWrapper>
        <S.IconLeft aria-hidden="true">
          <IoCalendarOutline size={18} />
        </S.IconLeft>
        <S.DatePickerRow>
          <DatePicker
            id="filter-date-from"
            value={value?.[0] || null}
            onChange={handleStartChange}
            format="MMM DD, YYYY"
            placeholder="From"
            allowClear
            aria-label="Filter by date from"
            style={{ width: '100%' }}
          />
          <span className="separator">—</span>
          <DatePicker
            id="filter-date-to"
            value={value?.[1] || null}
            onChange={handleEndChange}
            format="MMM DD, YYYY"
            placeholder="To"
            allowClear
            aria-label="Filter by date to"
            style={{ width: '100%' }}
          />
        </S.DatePickerRow>
      </S.PickerWrapper>
    </S.Wrapper>
  );
};

export default memo(DateFilter);