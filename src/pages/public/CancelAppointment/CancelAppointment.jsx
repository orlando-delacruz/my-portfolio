// src/pages/public/CancelAppointment/CancelAppointment.jsx
import { memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCancelAppointment } from './useCancelAppointment';
import * as S from './CancelAppointment.styled';

const CancelAppointment = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    loading,
    appointment,
    error,
    cancelling,
    cancelAppointment,
  } = useCancelAppointment(token);

  if (loading) {
    return (
      <S.PageWrapper>
        <S.Card>
          <S.LoadingText>Verifying your request...</S.LoadingText>
        </S.Card>
      </S.PageWrapper>
    );
  }

  if (error) {
    return (
      <S.PageWrapper>
        <S.Card>
          <S.ErrorIcon>⚠️</S.ErrorIcon>
          <S.ErrorTitle>Something went wrong</S.ErrorTitle>
          <S.ErrorMessage>{error}</S.ErrorMessage>
          <S.BackLink href="/">Return to Homepage</S.BackLink>
        </S.Card>
      </S.PageWrapper>
    );
  }

  if (!appointment) {
    return (
      <S.PageWrapper>
        <S.Card>
          <S.ErrorIcon>🔍</S.ErrorIcon>
          <S.ErrorTitle>Appointment not found</S.ErrorTitle>
          <S.ErrorMessage>The cancellation link may be invalid or already used.</S.ErrorMessage>
          <S.BackLink href="/">Return to Homepage</S.BackLink>
        </S.Card>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.Card>
        <S.Brand>
          <S.Logo src="/logo.png" alt="Leidi Bud Dentals" />
          <S.BrandName>Leidi Bud Dentals</S.BrandName>
        </S.Brand>

        <S.Title>Cancel Appointment</S.Title>

        <S.AppointmentSummary>
          <S.SummaryRow>
            <S.SummaryLabel>Patient</S.SummaryLabel>
            <S.SummaryValue>{appointment.patientName}</S.SummaryValue>
          </S.SummaryRow>
          <S.SummaryRow>
            <S.SummaryLabel>Date</S.SummaryLabel>
            <S.SummaryValue>{appointment.date}</S.SummaryValue>
          </S.SummaryRow>
          <S.SummaryRow>
            <S.SummaryLabel>Time</S.SummaryLabel>
            <S.SummaryValue>{appointment.time}</S.SummaryValue>
          </S.SummaryRow>
          <S.SummaryRow>
            <S.SummaryLabel>Branch</S.SummaryLabel>
            <S.SummaryValue>{appointment.branch}</S.SummaryValue>
          </S.SummaryRow>
          <S.SummaryRow>
            <S.SummaryLabel>Service</S.SummaryLabel>
            <S.SummaryValue>{appointment.service}</S.SummaryValue>
          </S.SummaryRow>
        </S.AppointmentSummary>

        <S.Warning>
          Are you sure you want to cancel this appointment? This action cannot be undone.
        </S.Warning>

        <S.ButtonGroup>
          <S.CancelBtn onClick={cancelAppointment} disabled={cancelling}>
            {cancelling ? 'Cancelling...' : 'Yes, Cancel Appointment'}
          </S.CancelBtn>
          <S.BackBtn as="a" href="/">
            No, Go Back
          </S.BackBtn>
        </S.ButtonGroup>
      </S.Card>
    </S.PageWrapper>
  );
};

export default memo(CancelAppointment);