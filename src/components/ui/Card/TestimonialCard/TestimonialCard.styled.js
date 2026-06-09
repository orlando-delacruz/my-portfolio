import styled, { css } from "styled-components";
import theme from "../../../../styles/theme";

export const Card = styled.article`
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  flex-shrink: 0;
 
  ${({ $featured }) =>
    $featured
      ? css`
          background: ${theme.colors.secondary};
          width: 380px;
          min-height: 450px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        `
      : css`
          background: ${theme.colors.primary};
          width: 300px;
          min-height: 380px;
        `}
 
  @media ${theme.media.tablet} {
    width: 100%;
    min-height: unset;
  }
`;

export const Quote = styled.p`
  font-size: 14px;
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.75;
  color: ${({ $featured }) => ($featured ? theme.colors.primary : theme.colors.white)};
`;

export const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

export const PatientName = styled.span`
  font-size: 18px;
  font-weight: ${theme.typography.weight.medium};
  line-height: 1.5;
  color: ${({ $featured }) => ($featured ? theme.colors.primary : theme.colors.white)};
`;

export const ServiceLabel = styled.span`
  font-size: 13px;
  font-weight: ${theme.typography.weight.medium};
  color: ${({ $featured }) =>
    $featured ? `${theme.colors.primary}99` : "rgba(255,255,255,0.72)"};
`;

export const StarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 4px;
 
  svg {
    color: #ffcc00;
    font-size: 18px;
  }
`;
