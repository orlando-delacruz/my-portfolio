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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 2px 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  padding: 10px;
`;

export const CardImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
  display: block;
`;

export const PriceBadge = styled.span`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  font-size: ${theme.typography.size.sm};
  font-weight: ${theme.typography.weight.medium};
  padding: 4px 12px;
  border-radius: 50px;
  line-height: 1.5;
  pointer-events: none;
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

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CardTitle = styled.h3`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
  margin: 0;
`;

export const CardTitleTl = styled.span`
  font-size: ${theme.typography.size.sm};
  font-weight: ${theme.typography.weight.regular};
  color: ${theme.colors.primary};
  line-height: 1.4;
  font-style: italic;
`;

export const CardDesc = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.6;
  margin: 0;
  opacity: 0.8;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 4px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  transition:
    opacity 0.15s ease,
    gap 0.15s ease;

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