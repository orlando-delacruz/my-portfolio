// src/components/layout/CallToAction/CallToAction.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from "antd";
import * as S from "./CallToAction.styled";
import Button from "../../ui/Button";
import { useCta } from "../../../hooks/cms/useCta";
import Loading from "../../common/Loading";

const CallToAction = () => {
  const navigate = useNavigate();
  const { data: cta, isLoading, error } = useCta();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !cta) {
    return (
      <S.CTASection id="cta" aria-labelledby="cta-heading">
        <Alert type="error" title="Failed to load CTA content" showIcon />
      </S.CTASection>
    );
  }

  const { title, description, background_image } = cta;

  // Static button labels and links
  const PRIMARY_BUTTON_TEXT = "Book Appointment";
  const PRIMARY_BUTTON_LINK = "/book";
  const SECONDARY_BUTTON_TEXT = "Contact Our Clinic";
  const SECONDARY_BUTTON_LINK = "https://www.messenger.com/t/105864438662342";

  const handleBookAppointment = () => {
    navigate(PRIMARY_BUTTON_LINK);
  };

  return (
    <S.CTASection id="cta" aria-labelledby="cta-heading">
      <S.CTACard $backgroundImage={background_image}>
        <S.CTAContent>
          <S.CTAHeading id="cta-heading">{title}</S.CTAHeading>
          <S.CTADescription>{description}</S.CTADescription>

          <S.CTAButtons>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookAppointment}
              aria-label={PRIMARY_BUTTON_TEXT}
            >
              {PRIMARY_BUTTON_TEXT}
            </Button>

            <Button
              variant="outline"
              size="sm"
              as="a"
              href={SECONDARY_BUTTON_LINK}
              aria-label={SECONDARY_BUTTON_TEXT}
              target="_blank"
              rel="noreferrer noopener"
            >
              {SECONDARY_BUTTON_TEXT}
            </Button>
          </S.CTAButtons>
        </S.CTAContent>

        {background_image && (
          <S.CTAImage
            src={background_image}
            alt="Call to action background"
            loading="lazy"
            decoding="async"
          />
        )}
      </S.CTACard>
    </S.CTASection>
  );
};

export default memo(CallToAction);