import { memo } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Button from "../Button";
import * as S from "./SuccessView.styled";

/**
 * @param {function} onReset
 */
const SuccessView = memo(({ onReset }) => (
  <S.SuccessBlock role="status" aria-live="polite">
    <S.SuccessIcon aria-hidden="true">
      <AiOutlineCheckCircle />
    </S.SuccessIcon>
    <S.SuccessTitle>Appointment Request Sent!</S.SuccessTitle>
    <S.SuccessBody>
      Thank you for booking with Leidi Bud Dentals. Our team will confirm your
      appointment via your mobile number or email within 24 hours.
    </S.SuccessBody>
    <Button variant="outline" size="sm" onClick={onReset} type="button">
      Book Another Appointment
    </Button>
  </S.SuccessBlock>
));

SuccessView.displayName = "SuccessView";
export default SuccessView;