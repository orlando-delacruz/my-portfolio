// src/pages/public/Home/sections/About/About.jsx
import { memo } from "react";
import * as S from "./About.styled";
import { about } from "../../../../../data/HomePage/about";

/* ─── Highlights list ─────────────────────────────────── */
const HighlightList = memo(({ highlights }) => (
  <S.HighlightList>
    {highlights.map(({ id, Icon, label }) => (
      <S.HighlightItem key={id}>
        <Icon aria-hidden="true" />
        <span>{label}</span>
      </S.HighlightItem>
    ))}
  </S.HighlightList>
));
HighlightList.displayName = "HighlightList";

/* ─── Main component ──────────────────────────────────── */
const About = () => {
  const { eyebrow, headingStart, headingAccent, body, highlights, image } = about;

  return (
    <S.AboutSection id="about" aria-labelledby="about-heading">
      {/* Header */}
      <S.SectionHeader>
        <S.Eyebrow>{eyebrow}</S.Eyebrow>
        <S.Heading id="about-heading">
          {headingStart}
          <span className="accent">{headingAccent}</span>
        </S.Heading>
      </S.SectionHeader>

      {/* Body — two-column grid */}
      <S.AboutBody>
        {/* Left: paragraphs + feature list */}
        <S.AboutContent>
          <S.BodyText>
            {body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </S.BodyText>

          <HighlightList highlights={highlights} />
        </S.AboutContent>

        {/* Right: clinic photo */}
        <S.AboutImage
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          width={800}
          height={475}
        />
      </S.AboutBody>
    </S.AboutSection>
  );
};

export default memo(About);