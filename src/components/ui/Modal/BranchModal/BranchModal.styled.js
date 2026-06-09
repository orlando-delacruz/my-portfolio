import styled from "styled-components";
import theme from "../../../../styles/theme";

export const ModalMapFrame = styled.iframe`
  width: 100%;
  height: 280px;
  border: none;
  border-radius: 14px;
  display: block;
  margin-bottom: 20px;
`;

export const ModalSection = styled.div`
  margin-bottom: 20px;
 
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalSectionLabel = styled.h4`
  font-size: 16px;
  font-weight: ${theme.typography.weight.semibold};
  color: ${theme.colors.primary};
  margin-bottom: 10px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${theme.colors.secondary};
`;

export const ModalContactRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  margin-bottom: 8px;
 
  a {
    color: ${theme.colors.primary};
    &:hover {
      text-decoration: underline;
    }
  }
 
  svg {
    color: ${theme.colors.primary};
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const ModalServiceGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  list-style: none;
  padding: 0;
`;

export const ModalServiceItem = styled.li`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.black};
  background: ${theme.colors.secondary};
  border-radius: 20px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: ${theme.typography.weight.medium};
 
  &::before {
    content: "✓";
    color: ${theme.colors.primary};
    font-weight: bold;
  }
`;
