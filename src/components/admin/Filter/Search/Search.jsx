// src/components/admin/Filter/Search/Search.jsx
import { memo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import * as S from "./Search.styled";

const Search = ({ value, onChange, placeholder }) => (
  <S.Wrapper>
    <S.Label htmlFor="filter-search">Search</S.Label>
    <S.InputWrapper>
      <S.IconLeft aria-hidden="true">
        <IoSearchOutline size={18} />
      </S.IconLeft>
      <S.StyledInput
        id="filter-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search patient name or mobile number…"}
        aria-label="Search by patient name or phone number"
        autoComplete="off"
      />
    </S.InputWrapper>
  </S.Wrapper>
);

export default memo(Search);