// src/pages/admin/Appointment/sections/Filter/Filter.styled.js
import styled from "styled-components";

export const FilterCard = styled.aside`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  /* Responsive grid: 4 columns desktop, 2 columns tablet/mobile */
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Divider between columns */
  & > * {
    border-right: 1px solid rgba(0, 0, 0, 0.06);
  }

  & > *:last-child {
    border-right: none;
  }

  /* On tablet/mobile hide the right border of every 2nd item */
  @media (max-width: 992px) {
    & > *:nth-child(2n) {
      border-right: none;
    }
  }
`;
