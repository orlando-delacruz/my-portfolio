// src/pages/public/BookAppointment/BookAppointment.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import BookAppointmentForm from "../../../components/ui/Form/BookAppointmentForm";
import * as S from "./BookAppointment.styled";

const BookAppointment = () => {
  const navigate = useNavigate();

  return (
    <S.PageWrapper>
      {/* Top nav bar */}
      <S.TopBar>
        <S.BackButton onClick={() => navigate("/")} aria-label="Back to homepage">
          <S.BackIconWrapper aria-hidden="true">
            <FiArrowLeft />
          </S.BackIconWrapper>
          <span>Back to Homepage</span>
        </S.BackButton>
      </S.TopBar>

      {/* Centered form */}
      <S.PageContent>
        <BookAppointmentForm />
      </S.PageContent>
    </S.PageWrapper>
  );
};

export default memo(BookAppointment);