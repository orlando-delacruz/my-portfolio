// src/pages/public/Home/sections/Hero/Hero.jsx
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsTelephoneOutboundFill } from 'react-icons/bs';
import { MdMedicalServices } from 'react-icons/md';
import { Icon } from '@iconify/react';
import { Alert } from 'antd';
import * as S from './Hero.styled';
import Button from '../../../../../components/ui/Button';
import { useHero } from '../../../../../hooks/cms/useHero';
import Loading from '../../../../../components/common/Loading';

// Legacy icon name mapping (for backward compatibility)
const legacyIconMap = {
  FaAward: 'mdi:award',
  FaStar: 'mdi:star',
  FaUsers: 'mdi:account-group',
};
const FallbackIcon = 'mdi:star';

const statClasses = ['stat--experience', 'stat--rating', 'stat--patients'];

const Hero = () => {
  const navigate = useNavigate();
  const { data: hero, isLoading, error } = useHero();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !hero) {
    return (
      <S.HeroSection id="home" aria-labelledby="hero-heading">
        <Alert type="error" title="Failed to load hero content" showIcon />
      </S.HeroSection>
    );
  }

  const handleBookAppointment = () => {
    navigate(hero.primary_button_link || '/book');
  };

  // Map cards from CMS to the format expected by the UI
  const stats = hero.cards?.map((card, index) => {
    // Support both legacy icon names and Iconify names
    let iconName = card.icon || FallbackIcon;
    // If it's a known legacy name, map it
    if (legacyIconMap[iconName]) {
      iconName = legacyIconMap[iconName];
    }
    // If it doesn't contain ':', assume it's legacy and fallback
    if (!iconName.includes(':')) {
      iconName = FallbackIcon;
    }
    return {
      id: card.id,
      icon: iconName,
      label: card.value || '',
      className: statClasses[index] || '',
    };
  }) || [];

  return (
    <S.HeroSection id="home" aria-labelledby="hero-heading">
      <S.HeroContent>
        <S.Badge aria-label="Section label">{hero.bio_badge}</S.Badge>

        <S.HeadingGroup>
          <S.Heading id="hero-heading">
            {hero.heading}
            <span className="accent">{hero.highlight_text}</span>
          </S.Heading>
          <S.Description>{hero.subheading}</S.Description>
        </S.HeadingGroup>

        <S.CtaGroup>
          <Button
            variant="primary"
            size="sm"
            onClick={handleBookAppointment}
            aria-label={hero.primary_button_text}
          >
            {hero.primary_button_text}
            <BsTelephoneOutboundFill aria-hidden="true" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            as="a"
            href="#services"
            aria-label="View our services"
          >
            View Services
            <MdMedicalServices aria-hidden="true" />
          </Button>
        </S.CtaGroup>
      </S.HeroContent>

      <S.HeroImageStage aria-hidden="true">
        <S.ImageGlow />
        {hero.hero_image ? (
          <S.HeroImage
            src={hero.hero_image}
            alt="Hero"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={800}
            height={600}
          />
        ) : (
          <div style={{ width: '100%', maxWidth: 580, height: 'auto', aspectRatio: '4/3', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, color: '#aaa', fontSize: 18, padding: 20 }}>
            No Image Available
          </div>
        )}
        {stats.map((stat) => (
          <S.StatBadge
            key={stat.id}
            className={stat.className}
            role="img"
            aria-label={stat.label}
          >
            <Icon icon={stat.icon} style={{ fontSize: 16 }} />
            <span>{stat.label}</span>
          </S.StatBadge>
        ))}
      </S.HeroImageStage>
    </S.HeroSection>
  );
};

export default memo(Hero);