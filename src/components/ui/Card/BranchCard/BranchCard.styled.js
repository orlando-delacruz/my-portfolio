import styled from "styled-components";
import theme from "../../../../styles/theme";

export const Card = styled.article`
  background: ${theme.colors.white};
  border-radius: 30px;
  box-shadow: 2px 2px 10px 1px rgba(0, 0, 0, 0.25);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
 
  &:hover {
    transform: translateY(-4px);
    box-shadow: 4px 6px 18px 2px rgba(0, 0, 0, 0.18);
  }
 
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 30px;
  }
`;

export const MapFrame = styled.iframe`
  width: 100%;
  height: 200px;
  border: none;
  border-radius: 10px;
  display: block;
  flex-shrink: 0;
`;

export const CardName = styled.h3`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
`;

export const CardBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BlockLabel = styled.p`
  font-size: 18px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${theme.colors.black};
  font-size: ${theme.typography.size.body};
 
  a {
    color: inherit;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const ContactIcon = styled.span`
  color: ${theme.colors.primary};
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
`;

export const ServiceList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  list-style: none;
`;

export const ServiceItem = styled.li`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  padding-left: 14px;
  position: relative;
 
  &::before {
    content: "•";
    position: absolute;
    left: 0;
    color: ${theme.colors.primary};
    font-weight: bold;
  }
`;

export const ViewDetailsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: auto;
`;

export const ViewDetailsBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
  text-decoration: underline;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s ease;
 
  &:hover {
    color: ${theme.colors.primaryDark};
  }
 
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
 
  svg {
    transition: transform 0.2s ease;
  }
 
  &:hover svg {
    transform: translateX(3px);
  }
`;