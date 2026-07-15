// src/pages/public/Home/sections/Gallery/Gallery.jsx
import { memo, useMemo } from 'react';
import { Alert } from 'antd';
import * as S from './Gallery.styled';
import SectionTitle from '../../../../../components/common/SectionTitle';
import { useGallery } from '../../../../../hooks/cms/useGallery';
import Loading from '../../../../../components/common/Loading';

import {
  FaUserFriends,
  FaTooth,
  FaTag,
  FaClinicMedical,
  FaHeart,
  FaAward,
  FaStar,
  FaUsers,
} from 'react-icons/fa';

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

const HighlightList = memo(({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;
  return (
    <S.HighlightList>
      {highlights.map(({ id, icon, label }) => {
        const IconComponent = iconMap[icon] || FallbackIcon;
        return (
          <S.HighlightItem key={id}>
            <IconComponent aria-hidden="true" />
            <span>{label}</span>
          </S.HighlightItem>
        );
      })}
    </S.HighlightList>
  );
});
HighlightList.displayName = 'HighlightList';

// ── Infinite Scroller Component ──────────────────────────────────────────────
// Seamless loop strategy: build one "padded" copy of the images that is long
// enough to always exceed the viewport height, then render that padded copy
// TWICE back-to-back and animate translateY(0) -> translateY(-50%) with a
// CSS keyframe. Because the two halves are pixel-identical, the wrap point
// is exact by construction — no runtime measurement, no drift, no blank gap.
const MIN_LOOP_ITEMS = 8;
const PX_PER_SECOND = 28; // approximate scroll speed used to size the animation duration
const APPROX_ITEM_HEIGHT = 230; // image height + margin-bottom, close enough for pacing

const InfiniteScroller = memo(({ images, direction }) => {
  const loopImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    const filled = [];
    while (filled.length < MIN_LOOP_ITEMS) {
      filled.push(...images);
    }
    return filled;
  }, [images]);

  const trackImages = useMemo(
    () => [...loopImages, ...loopImages],
    [loopImages]
  );

  const duration = useMemo(() => {
    const copyHeight = loopImages.length * APPROX_ITEM_HEIGHT;
    return Math.max(15, copyHeight / PX_PER_SECOND);
  }, [loopImages.length]);

  if (images.length === 0) {
    return <S.EmptyColumn />;
  }

  return (
    <S.ScrollViewport>
      <S.ScrollTrack className="scroll-track" $direction={direction} $duration={duration}>
        {trackImages.map(({ id, image_url }, index) => (
          <S.GalleryImage
            key={`${id}-${index}`}
            src={image_url}
            alt="Gallery image"
            loading="lazy"
            decoding="async"
            fetchPriority={index < 4 ? 'high' : 'auto'}
          />
        ))}
      </S.ScrollTrack>
    </S.ScrollViewport>
  );
});
InfiniteScroller.displayName = 'InfiniteScroller';

const Gallery = () => {
  const { data: gallery, isLoading, error } = useGallery();

  const { columnUp, columnDown, highlights } = useMemo(() => {
    const images = gallery?.images || [];
    const up = images.filter((img) => img.gallery_position === 'up');
    const down = images.filter((img) => img.gallery_position !== 'up');
    return {
      columnUp: up,
      columnDown: down,
      highlights: gallery?.highlights || [],
    };
  }, [gallery]);

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !gallery) {
    return (
      <S.GallerySection id="gallery" aria-labelledby="gallery-heading">
        <Alert type="error" message="Failed to load gallery content" showIcon />
      </S.GallerySection>
    );
  }

  const { pre_title, title, highlight_text, description } = gallery;

  return (
    <S.GallerySection id="gallery" aria-labelledby="gallery-heading">
      <S.GalleryHeader>
        <SectionTitle
          eyebrow={pre_title}
          headingStart={title}
          headingAccent={highlight_text || ''}
          id="gallery-heading"
        />
        <S.Description>{description}</S.Description>
        <HighlightList highlights={highlights} />
      </S.GalleryHeader>

      <S.GalleryColumns>
        <InfiniteScroller images={columnUp} direction="up" />
        <InfiniteScroller images={columnDown} direction="down" />
      </S.GalleryColumns>
    </S.GallerySection>
  );
};

export default memo(Gallery);