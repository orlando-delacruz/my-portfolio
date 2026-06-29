import { memo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import * as S from "./Search.styled";

/**
 * Search
 * Searches by: patient name, phone number, reference ID, or reason.
 *
 * @param {string}   value
 * @param {function} onChange
 */
const Search = ({ value, onChange }) => (
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
        placeholder="Name, phone, ID or reason…"
        aria-label="Search by patient name, phone number, reference ID, or reason"
        autoComplete="off"
      />
    </S.InputWrapper>
  </S.Wrapper>
);

export default memo(Search);