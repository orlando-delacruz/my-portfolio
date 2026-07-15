// src/pages/public/Home/sections/WhyUs/WhyUs.jsx
import { memo } from 'react';
import { Alert } from 'antd';
import { Icon } from '@iconify/react';
import * as S from './WhyUs.styled';
import SectionTitle from '../../../../../components/common/SectionTitle';
import { useWhyChooseUs } from '../../../../../hooks/cms/useWhyChooseUs';
import Loading from '../../../../../components/common/Loading';

const FallbackIcon = 'mdi:star';

const WhyUsCard = memo(({ icon, title, description }) => (
  <S.Card>
    <S.CardIconWrapper>
      <S.IconCircle>
        <Icon icon={icon || FallbackIcon} style={{ fontSize: 30 }} />
      </S.IconCircle>
      <S.CardTitle>{title}</S.CardTitle>
    </S.CardIconWrapper>
    <S.CardDescription>{description}</S.CardDescription>
  </S.Card>
));
WhyUsCard.displayName = 'WhyUsCard';

const WhyUs = () => {
  const { data: section, isLoading, error } = useWhyChooseUs();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !section) {
    return (
      <S.WhyUsSection id="why-us" aria-labelledby="whyus-heading">
        <Alert type="error" title="Failed to load content" showIcon />
      </S.WhyUsSection>
    );
  }

  const { pre_title, title, highlight_text, cards = [] } = section;

  return (
    <S.WhyUsSection id="why-us" aria-labelledby="whyus-heading">
      <SectionTitle
        eyebrow={pre_title}
        headingStart={title}
        headingAccent={highlight_text}
        id="whyus-heading"
      />

      <S.CardsGrid>
        {cards.map((card) => (
          <WhyUsCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </S.CardsGrid>
    </S.WhyUsSection>
  );
};

export default memo(WhyUs);