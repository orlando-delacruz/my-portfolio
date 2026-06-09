// src/components/ui/Card/ServiceCard.styled.js
import styled from "styled-components";
import theme from "../../../../styles/theme";

export const Card = styled.article`
  background: ${theme.colors.white};
  border-radius: 20px;
  box-shadow: 1px 2px 10px 1px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 2px 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  padding: 10px;
  display: block;
`;

export const CardBody = styled.div`
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

export const CardTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
  margin: 0;
`;

export const CardDesc = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.6;
  margin: 0;
  opacity: 0.8;

  /* clamp to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ViewDetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.15s ease, gap 0.15s ease;

  svg {
    font-size: 18px;
    transition: transform 0.15s ease;
  }

  &:hover {
    opacity: 0.75;

    svg {
      transform: translateX(3px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;