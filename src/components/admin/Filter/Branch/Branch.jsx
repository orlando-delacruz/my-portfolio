// src/components/admin/Filter/Branch/Branch.jsx
import { memo } from "react";
import { Select } from "antd";
import { IoLocationOutline } from "react-icons/io5";
import { useBranches } from "../../../../hooks/useBranches";
import * as S from "./Branch.styled";

const { Option } = Select;

/**
 * @param {string}   value
 * @param {function} onChange
 */
const Branch = ({ value, onChange }) => {
  const { branches, loading } = useBranches();

  return (
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
          loading={loading}
        >
          <Option value="all">All Branches</Option>
          {branches.map((b) => (
            <Option key={b.id} value={b.id}>
              {b.name}
            </Option>
          ))}
        </S.StyledSelect>
      </S.SelectWrapper>
    </S.Wrapper>
  );
};

export default memo(Branch);