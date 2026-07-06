// src/pages/admin/Settings/sections/MyProfile/MyProfile.styled.js
import styled from "styled-components";
import adminTheme from "../../../../../styles/adminTheme";

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AvatarSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px 0 8px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const AvatarUploadBtn = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;

  .ant-upload {
    display: block;
  }
`;

export const FieldGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .ant-form-item {
    margin-bottom: 0;
  }

  .ant-form-item-label {
    padding: 0 0 2px 0;

    label {
      color: rgba(0, 0, 0, 0.50);
      font-size: 10px;
      font-weight: 400;
      height: auto;
    }
  }

  .ant-input {
    border-radius: 5px;
    border-color: rgba(0, 0, 0, 0.20);
    font-size: 10px;
    padding: 4px 8px;
    height: 28px;

    &:hover,
    &:focus {
      border-color: #886217;
      box-shadow: 0 0 0 2px rgba(136, 98, 23, 0.10);
    }
  }
`;

export const PasswordDisplay = styled.div`
  width: 100%;
  padding: 4px 8px;
  border-radius: 5px;
  outline: 1px solid rgba(0, 0, 0, 0.20);
  outline-offset: -1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${adminTheme.colors.white};
  min-height: 28px;

  span {
    color: ${adminTheme.colors.black};
    font-size: 10px;
    font-weight: 400;
  }
`;

export const GoogleSection = styled.div`
  width: 100%;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`;

export const GoogleLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const GoogleIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const GoogleText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const GoogleTitle = styled.span`
  color: ${adminTheme.colors.black};
  font-size: 12px;
  font-weight: 400;
  word-wrap: break-word;
`;

export const GoogleStatus = styled.span`
  color: ${({ $connected }) => ($connected ? "#11D896" : "#888")};
  font-size: 10px;
  font-weight: 400;
  word-wrap: break-word;
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`;