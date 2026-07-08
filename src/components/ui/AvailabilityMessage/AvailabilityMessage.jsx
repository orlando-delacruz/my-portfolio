// src/components/ui/AvailabilityMessage/AvailabilityMessage.jsx
import { MdEventBusy, MdOutlineEventBusy } from "react-icons/md";
import * as S from "./AvailabilityMessage.styled";

const AvailabilityMessage = ({ isClosed, isFullyBooked }) => {
  if (isClosed) {
    return (
      <S.WarningCard>
        <S.CardIcon>
          <MdEventBusy size={20} />
        </S.CardIcon>
        <S.CardContent>
          <S.CardTitle>Clinic Closed</S.CardTitle>
          <S.CardDescription>
            The selected date is unavailable because the clinic is closed.
            Please choose another available date.
          </S.CardDescription>
        </S.CardContent>
      </S.WarningCard>
    );
  }

  if (isFullyBooked) {
    return (
      <S.WarningCard>
        <S.CardIcon>
          <MdOutlineEventBusy size={20} />
        </S.CardIcon>
        <S.CardContent>
          <S.CardTitle>Fully Booked</S.CardTitle>
          <S.CardDescription>
            There are no remaining appointment slots for this date. Please choose another date.
          </S.CardDescription>
        </S.CardContent>
      </S.WarningCard>
    );
  }

  return null;
};

export default AvailabilityMessage;