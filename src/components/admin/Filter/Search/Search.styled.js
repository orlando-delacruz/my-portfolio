// src/components/admin/Filter/Search/Search.styled.js
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 20px;
`;

export const Label = styled.label`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #222222;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const IconLeft = styled.span`
  position: absolute;
  left: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  color: #222222;
  pointer-events: none;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 34px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #ffffff;
  font-family: "Inter", sans-serif;
  font-size: 10px;
  line-height: 15px;
  color: #222222;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #686868;
  }

  &:hover {
    border-color: rgba(0, 0, 0, 0.2);
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.3);
  }

  /* Remove browser default search clear button */
  &::-webkit-search-cancel-button {
    display: none;
  }
`;
