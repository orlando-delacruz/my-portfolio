// src/pages/public/Home/sections/Gallery/Gallery.jsx
import { memo, useMemo } from 'react';
import { Alert } from 'antd';
import { Icon } from '@iconify/react';
import * as S from './Gallery.styled';
import SectionTitle from '../../../../../components/common/SectionTitle';
import { useGallery } from '../../../../../hooks/cms/useGallery';
import Loading from '../../../../../components/common/Loading';

const FallbackIcon = 'mdi:star';

const HighlightList = memo(({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;
  return (
    <S.HighlightList>
      {highlights.map(({ id, icon, label }) => {
        const iconName = icon || FallbackIcon;
        const finalIcon = iconName.includes(':') ? iconName : FallbackIcon;
        return (
          <S.HighlightItem key={id}>
            <Icon icon={finalIcon} style={{ fontSize: 20, color: '#886217', flexShrink: 0 }} />
            <span>{label}</span>
          </S.HighlightItem>
        );
      })}
    </S.HighlightList>
  );
});
HighlightList.displayName = 'HighlightList';

// ── Infinite Scroller ────────────────────────────────────────────────────
// Loop strategy: pad the image list to a minimum length, then render that
// padded copy THREE times back-to-back. Because all three copies are
// pixel-identical, animating exactly 0 -> -33.3333% (or the reverse) loops
// with zero seam. The extra (3rd) copy also gives buffer above/below so the
// mask fade never reveals a duplicate/seam edge.
const MIN_LOOP_ITEMS = 8;
const PX_PER_SECOND = 28; // approximate scroll speed used to size the animation duration
const APPROX_ITEM_HEIGHT = 230; // image height + margin-bottom, close enough for pacing

const InfiniteColumn = memo(({ images, direction }) => {
  const paddedImages = useMemo(() => {
    if (!images || images.length === 0) return [];
    const filled = [];
    while (filled.length < MIN_LOOP_ITEMS) {
      filled.push(...images);
    }
    return filled;
  }, [images]);

  const trackImages = useMemo(
    () => [...paddedImages, ...paddedImages, ...paddedImages],
    [paddedImages]
  );

  const duration = useMemo(() => {
    const copyHeight = paddedImages.length * APPROX_ITEM_HEIGHT;
    return Math.max(15, copyHeight / PX_PER_SECOND);
  }, [paddedImages.length]);

  if (!images || images.length === 0) {
    return <S.EmptyColumn />;
  }

  return (
    <S.ScrollViewport>
      <S.ScrollTrack $direction={direction} $duration={duration}>
        {trackImages.map(({ id, image_url }, index) => (
          <S.GalleryImage
            key={`${id}-${index}`}
            src={image_url}
            alt="Gallery image"
            loading="lazy"
            decoding="async"
            fetchpriority={index < 4 ? 'high' : 'auto'}
          />
        ))}
      </S.ScrollTrack>
    </S.ScrollViewport>
  );
});
InfiniteColumn.displayName = 'InfiniteColumn';

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

      <S.GalleryColumns aria-label="Clinic gallery images">
        <InfiniteColumn images={columnUp} direction="up" />
        <InfiniteColumn images={columnDown} direction="down" />
      </S.GalleryColumns>
    </S.GallerySection>
  );
};

export default memo(Gallery);