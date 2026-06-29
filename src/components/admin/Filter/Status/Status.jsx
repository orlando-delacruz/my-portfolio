// src/components/admin/Filter/Status/Status.jsx
import { memo } from "react";
import { Select } from "antd";
import { IoFilterOutline } from "react-icons/io5";
import { STATUS_OPTIONS } from "../../../../data/admin/appointment";
import * as S from "./Status.styled";

const { Option } = Select;

/**
 * @param {string}   value
 * @param {function} onChange
 */
const Status = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-status">Status</S.Label>
    <S.SelectWrapper>
      <S.IconLeft aria-hidden="true">
        <IoFilterOutline size={18} />
      </S.IconLeft>
      <S.StyledSelect
        id="filter-status"
        value={value}
        onChange={onChange}
        aria-label="Filter by appointment status"
        popupMatchSelectWidth={false}
      >
        {STATUS_OPTIONS.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </S.StyledSelect>
    </S.SelectWrapper>
  </S.Wrapper>
);

export default memo(Status);