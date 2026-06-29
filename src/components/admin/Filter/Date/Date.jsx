// src/components/admin/Filter/Date/Date.jsx
import { memo } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import * as S from "./Date.styled";

/**
 * @param {[dayjs, dayjs]} value
 * @param {function}        onChange
 */
const DateFilter = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-date">Date</S.Label>
    <S.PickerWrapper>
      <S.IconLeft aria-hidden="true">
        <IoCalendarOutline size={18} />
      </S.IconLeft>
      <S.StyledRangePicker
        id="filter-date"
        value={value}
        onChange={onChange}
        format="MMM DD, YYYY"
        allowClear
        aria-label="Filter by date range"
        suffixIcon={null}
      />
    </S.PickerWrapper>
  </S.Wrapper>
);

export default memo(DateFilter);