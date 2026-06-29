// src/pages/admin/Appointment/sections/PageTitle/PageTitle.jsx
import { memo } from "react";
import { IoAddOutline } from "react-icons/io5";
import Button from "../../../../../components/admin/Button/Button";
import { PAGE_TITLE, ADD_BUTTON_LABEL } from "../../../../../data/admin/appointment";
import * as S from "./PageTitle.styled";

/**
 * @param {function} onAdd — triggered when "Add Appointment" is clicked
 */
const PageTitle = ({ onAdd }) => (
  <S.Header>
    <S.TitleGroup>
      <S.Title>{PAGE_TITLE}</S.Title>
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