import styled from "styled-components";
import theme from "../../../../../styles/theme";

export const Section = styled.section`
  background: ${theme.colors.background};
  color: ${theme.colors.black};
`;

export const CarouselWrapper = styled.div`
  width: 100%;
  padding: 40px 0 50px;
`;

export const CarouselTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
 
  @media ${theme.media.tablet} {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
`;

export const NavRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  padding-top: 8px;
`;

export const NavButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: background 0.2s ease, transform 0.15s ease;
  flex-shrink: 0;
 
  &:hover {
    background: ${theme.colors.primaryDark};
    transform: scale(1.08);
  }
 
  &:active {
    transform: scale(0.96);
  }
 
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
  }
 
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

export const DotRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
`;

export const Dot = styled.button`
  width: ${({ $active }) => ($active ? "24px" : "10px")};
  height: 10px;
  border-radius: 10px;
  background: ${theme.colors.primary};
  opacity: ${({ $active }) => ($active ? "1" : "0.3")};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.25s ease, opacity 0.25s ease;
 
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
  }
`;
