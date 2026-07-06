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
          <S.CardTitle>Selected date is closed.</S.CardTitle>
          <S.CardDescription>
            The clinic is not accepting appointments on this day. Please choose another date.
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
          <S.CardTitle>Selected date is fully booked.</S.CardTitle>
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