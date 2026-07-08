// src/components/admin/Settings/ToggleSwitch/ToggleSwitch.styled.js
import styled from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

export const Wrapper = styled.div`
  width: 100%;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const Label = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 12px;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  line-height: 18px;
`;

export const Description = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 10px;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  line-height: 15px;
  opacity: 0.7;
`;