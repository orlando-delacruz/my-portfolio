// src/pages/public/Home/sections/WhyUs/WhyUs.jsx
import { memo } from "react";
import * as S from "./WhyUs.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { whyUs } from "../../../../../data/HomePage/whyUs";

/* ─── Single reason card ──────────────────────────────── */
const WhyUsCard = memo(({ Icon, title, description }) => (
  <S.Card>
    <S.CardIconWrapper>
      <S.IconCircle>
        <Icon aria-hidden="true" />
      </S.IconCircle>
      <S.CardTitle>{title}</S.CardTitle>
    </S.CardIconWrapper>
    <S.CardDescription>{description}</S.CardDescription>
  </S.Card>
));
WhyUsCard.displayName = "WhyUsCard";

/* ─── Main component ──────────────────────────────────── */
const WhyUs = () => {
  const { eyebrow, headingStart, headingAccent, cards } = whyUs;

  return (
    <S.WhyUsSection id="why-us" aria-labelledby="whyus-heading">
      <SectionTitle
        eyebrow={eyebrow}
        headingStart={headingStart}
        headingAccent={headingAccent}
        id="whyus-heading"
      />

      <S.CardsGrid>
        {cards.map(({ id, Icon, title, description }) => (
          <WhyUsCard key={id} Icon={Icon} title={title} description={description} />
        ))}
      </S.CardsGrid>
    </S.WhyUsSection>
  );
};

export default memo(WhyUs);