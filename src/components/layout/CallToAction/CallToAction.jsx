// src/components/layout/CallToAction/CallToAction.jsx
import { memo } from "react";
import * as S from "./CallToAction.styled";
import { callToAction } from "../../../data/callToAction";

const CallToAction = () => {
  const { heading, description, primaryCta, secondaryCta, image } = callToAction;

  return (
    <S.CTASection id="cta" aria-labelledby="cta-heading">
      <S.CTACard>
        {/* Text + buttons */}
        <S.CTAContent>
          <S.CTAHeading id="cta-heading">{heading}</S.CTAHeading>
          <S.CTADescription>{description}</S.CTADescription>

          <S.CTAButtons>
            <S.PrimaryCtaButton
              href={primaryCta.href}
              aria-label={primaryCta.ariaLabel}
            >
              {primaryCta.label}
            </S.PrimaryCtaButton>

            <S.SecondaryCtaButton
              href={secondaryCta.href}
              aria-label={secondaryCta.ariaLabel}
            >
              {secondaryCta.label}
            </S.SecondaryCtaButton>
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