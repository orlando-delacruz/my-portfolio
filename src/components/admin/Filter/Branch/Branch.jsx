// src/components/admin/Filter/Branch/Branch.jsx
import { memo } from "react";
import { Select } from "antd";
import { IoLocationOutline } from "react-icons/io5";
import { BRANCH_OPTIONS } from "../../../../data/admin/appointment";
import * as S from "./Branch.styled";

const { Option } = Select;

/**
 * @param {string}   value
 * @param {function} onChange
 */
const Branch = ({ value, onChange }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-branch">Branch</S.Label>
    <S.SelectWrapper>
      <S.IconLeft aria-hidden="true">
        <IoLocationOutline size={16} />
      </S.IconLeft>
      <S.StyledSelect
        id="filter-branch"
        value={value}
        onChange={onChange}
        aria-label="Filter by branch"
        popupMatchSelectWidth={false}
      >
        {BRANCH_OPTIONS.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </S.StyledSelect>
    </S.SelectWrapper>
  </S.Wrapper>
);

export default memo(Branch);