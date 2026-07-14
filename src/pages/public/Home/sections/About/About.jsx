// src/pages/public/Home/sections/About/About.jsx
import { memo } from "react";
import { Alert } from "antd";
import * as S from "./About.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { useAbout } from "../../../../../hooks/cms/useAbout";
import Loading from "../../../../../components/common/Loading";

// Map icon strings to actual icon components
import { FaUserFriends, FaTooth, FaTag, FaClinicMedical, FaHeart, FaAward, FaStar, FaUsers } from "react-icons/fa";

const iconMap = {
  FaUserFriends,
  FaTooth,
  FaTag,
  FaClinicMedical,
  FaHeart,
  FaAward,
  FaStar,
  FaUsers,
};
const FallbackIcon = FaStar;

const HighlightList = memo(({ highlights }) => (
  <S.HighlightList>
    {highlights.map(({ id, icon, title }) => {
      const IconComponent = iconMap[icon] || FallbackIcon;
      return (
        <S.HighlightItem key={id}>
          <IconComponent aria-hidden="true" />
          <span>{title}</span>
        </S.HighlightItem>
      );
    })}
  </S.HighlightList>
));
HighlightList.displayName = "HighlightList";

const About = () => {
  const { data: about, isLoading, error } = useAbout();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !about) {
    return (
      <S.AboutSection id="about" aria-labelledby="about-heading">
        <Alert type="error" message="Failed to load about content" showIcon />
      </S.AboutSection>
    );
  }

  const { pre_title, title, accent_text, description, image, features } = about;

  const bodyParagraphs = description ? description.split('\n').filter(p => p.trim()) : [];

  return (
    <S.AboutSection id="about" aria-labelledby="about-heading">
      <SectionTitle
        eyebrow={pre_title}
        headingStart={title}
        headingAccent={accent_text}
        id="about-heading"
      />

      <S.AboutBody>
        <S.AboutContent>
          <S.BodyText>
            {bodyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </S.BodyText>
          <HighlightList highlights={features || []} />
        </S.AboutContent>

        <S.AboutImage
          src={image || 'https://via.placeholder.com/800x475?text=No+Image'}
          alt={title}
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