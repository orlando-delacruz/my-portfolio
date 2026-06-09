// src/pages/public/Home/sections/Hero/Hero.jsx
import { memo } from "react";
import { BsTelephoneOutboundFill } from "react-icons/bs";
import { MdMedicalServices } from "react-icons/md";
import { FaAward, FaStar, FaUsers } from "react-icons/fa";
import * as S from "./Hero.styled";
import Button from "../../../../../components/ui/Button/Button";
import { hero } from "../../../../../data/HomePage/hero";

/* ─── Icon map ─────────────────────────────────────────── */
const statIcons = {
  award: <FaAward aria-hidden="true" />,
  star: <FaStar aria-hidden="true" />,
  users: <FaUsers aria-hidden="true" />,
};

const statPositionClass = {
  experience: "stat--experience",
  rating: "stat--rating",
  patients: "stat--patients",
};

/* ─── Sub-components ───────────────────────────────────── */
const StatBadges = memo(({ stats }) =>
  stats.map(({ id, icon, label }) => (
    <S.StatBadge
      key={id}
      className={statPositionClass[id]}
      role="img"
      aria-label={label}
    >
      {statIcons[icon]}
      <span>{label}</span>
    </S.StatBadge>
  ))
);
StatBadges.displayName = "StatBadges";

/* ─── Main component ───────────────────────────────────── */
const Hero = () => {
  const { badge, headingStart, headingAccent, description, primaryCta, secondaryCta, image, stats } =
    hero;

  return (
    <S.HeroSection id="home" aria-labelledby="hero-heading">
      {/* Left — copy */}
      <S.HeroContent>
        <S.Badge aria-label="Section label">{badge}</S.Badge>

        <S.HeadingGroup>
          <S.Heading id="hero-heading">
            {headingStart}
            <span className="accent">{headingAccent}</span>
          </S.Heading>
          <S.Description>{description}</S.Description>
        </S.HeadingGroup>

        <S.CtaGroup>
          <Button
            variant="primary"
            size="sm"
            as="a"
            href={primaryCta.href}
            aria-label={primaryCta.ariaLabel}
          >
            <BsTelephoneOutboundFill aria-hidden="true" />
            {primaryCta.label}
          </Button>

          <Button
            variant="outline"
            size="sm"
            as="a"
            href={secondaryCta.href}
            aria-label={secondaryCta.ariaLabel}
          >
            {secondaryCta.label}
            <MdMedicalServices aria-hidden="true" />
          </Button>
        </S.CtaGroup>
      </S.HeroContent>

      {/* Right — image stage with floating badges */}
      <S.HeroImageStage aria-hidden="true">
        <S.ImageGlow />
        <S.HeroImage
          src={image.src}
          alt={image.alt}
          loading="eager"
          fetchpriority="high"
          decoding="async"
          width={800}
          height={600}
        />
        <StatBadges stats={stats} />
      </S.HeroImageStage>
    </S.HeroSection>
  );
};

export default memo(Hero);