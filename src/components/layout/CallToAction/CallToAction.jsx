// src/components/layout/CallToAction/CallToAction.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./CallToAction.styled";
import { callToAction } from "../../../data/callToAction";
import Button from "../../ui/Button"

const CallToAction = () => {
  const navigate = useNavigate();
  const { heading, description, primaryCta, secondaryCta, image } = callToAction;

  const handleBookAppointment = () => {
    navigate("/book");
  };

  return (
    <S.CTASection id="cta" aria-labelledby="cta-heading">
      <S.CTACard>
        {/* Text + buttons */}
        <S.CTAContent>
          <S.CTAHeading id="cta-heading">{heading}</S.CTAHeading>
          <S.CTADescription>{description}</S.CTADescription>

          <S.CTAButtons>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookAppointment}
              aria-label={primaryCta.ariaLabel}
            >
              {primaryCta.label}
            </Button>

            <Button
              variant="outline"
              size="sm"
              as="a"
              href={secondaryCta.href}
              aria-label={secondaryCta.ariaLabel}
              target="_blank"
              rel="noreferrer noopener"
            >
              {secondaryCta.label}
            </Button>
          </S.CTAButtons>
        </S.CTAContent>

        {/* Clinic photo */}
        <S.CTAImage
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          width={900}
          height={380}
        />
      </S.CTACard>
    </S.CTASection>
  );
};

export default memo(CallToAction);