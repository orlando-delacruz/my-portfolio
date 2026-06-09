// src/components/common/SectionTitle/SectionTitle.styled.js
import styled from "styled-components";
import theme from "../../../styles/theme";

export const SectionTitleWrapper = styled.header`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Eyebrow = styled.span`
  display: inline-block;
  padding-bottom: 5px;
  border-bottom: 2px solid ${theme.colors.primary};
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  width: fit-content;
`;

export const Heading = styled.h2`
  font-size: ${theme.typography.heading.h2};
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  color: ${theme.colors.black};
  margin: 0;

  span.accent {
    color: ${theme.colors.primary};
  }
`;