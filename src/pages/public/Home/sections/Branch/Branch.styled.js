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

export const Description = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.7;
  opacity: 0.85;
  margin: 0 0 16px 0;
  text-align: center;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${theme.colors.gray};
  font-size: ${theme.typography.size.body};
`;
