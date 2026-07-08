// src/pages/admin/Appointment/sections/PageTitle/PageTitle.jsx
import { memo } from "react";
import { IoAddOutline } from "react-icons/io5";
import Button from "../../../../../components/admin/Button/Button";
import { PAGE_TITLE, ADD_BUTTON_LABEL } from "../../../../../data/admin/appointment";
import * as S from "./PageTitle.styled";

const PageTitle = ({ onAdd }) => (
  <S.Header>
    <S.TitleGroup>
      <S.Title>{PAGE_TITLE}</S.Title>
      <S.Subtitle>
        Manage, filter, and monitor all patient appointment requests in one place.
      </S.Subtitle>
    </S.TitleGroup>
    <Button
      icon={<IoAddOutline size={24} color="#ffffff" />}
      label={ADD_BUTTON_LABEL}
      variant="primary"
      onClick={onAdd}
      aria-label="Add new appointment"
    />
  </S.Header>
);

export default memo(PageTitle);