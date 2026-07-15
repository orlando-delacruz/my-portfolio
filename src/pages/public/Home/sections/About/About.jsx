// src/pages/public/Home/sections/About/About.jsx
import { memo } from "react";
import { Alert } from "antd";
import { Icon } from '@iconify/react';
import * as S from "./About.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { useAbout } from "../../../../../hooks/cms/useAbout";
import Loading from "../../../../../components/common/Loading";

// Legacy icon name mapping (for backward compatibility)
const legacyIconMap = {
  FaUserFriends: 'mdi:account-group',
  FaTooth: 'mdi:tooth-outline',
  FaTag: 'mdi:tag',
  FaClinicMedical: 'mdi:medical-bag',
  FaHeart: 'mdi:heart',
  FaAward: 'mdi:award',
  FaStar: 'mdi:star',
  FaUsers: 'mdi:account-group',
};
const FallbackIcon = 'mdi:star';

const HighlightList = memo(({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;
  return (
    <S.HighlightList>
      {highlights.map(({ id, icon, title }) => {
        // Support both legacy and Iconify names
        let iconName = icon || FallbackIcon;
        if (legacyIconMap[iconName]) {
          iconName = legacyIconMap[iconName];
        }
        // If it doesn't contain ':', treat as legacy and fallback
        if (!iconName.includes(':')) {
          iconName = FallbackIcon;
        }
        return (
          <S.HighlightItem key={id}>
            <Icon icon={iconName} style={{ fontSize: 20, color: '#886217' }} />
            <span>{title}</span>
          </S.HighlightItem>
        );
      })}
    </S.HighlightList>
  );
});
HighlightList.displayName = "HighlightList";

const About = () => {
  const { data: about, isLoading, error } = useAbout();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !about) {
    return (
      <S.AboutSection id="about" aria-labelledby="about-heading">
        <Alert type="error" title="Failed to load about content" showIcon />
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