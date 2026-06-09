import styled from "styled-components";
import theme from "../../../../../styles/theme";

export const Section = styled.section`
  background: ${theme.colors.background};
  color: ${theme.colors.black};
`;

export const BranchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 50px;
 
  @media ${theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;
