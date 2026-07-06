// src/pages/admin/Settings/sections/ClinicInformation/ClinicInformation.styled.js
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

export const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`;