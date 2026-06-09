import styled from "styled-components";
import theme from "../../../../../styles/theme";

export const Section = styled.section`
  background: ${theme.colors.background};
  color: ${theme.colors.black};
`;

export const SectionInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
 
  @media ${theme.media.tablet} {
    grid-template-columns: 1fr;
    gap: 48px;
  }
`;
