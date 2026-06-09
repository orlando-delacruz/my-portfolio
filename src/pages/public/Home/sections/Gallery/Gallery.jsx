// src/pages/public/Home/sections/Gallery/Gallery.jsx
import { memo } from "react";
import * as S from "./Gallery.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { gallery } from "../../../../../data/HomePage/gallery";

/**
 *
 * @param {Array}   images
 * @param {"scroll-down"|"scroll-up"} direction
 * @param {boolean} lightAccent
 */
const InfiniteColumn = memo(({ images, direction }) => {
  const content = (
    <>
      {images.map(({ id, src, alt }) => (
        <S.GalleryImage
          key={id}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      ))}
    </>
  );

  return (
    <S.ScrollTrack className={direction} aria-hidden="true">
      {content}
      {content}
    </S.ScrollTrack>
  );
});
InfiniteColumn.displayName = "InfiniteColumn";

//  MAIN COMPONENT
const Gallery = () => {
  const {
    eyebrow,
    headingStart,
    headingAccent,
    description,
    highlights,
    columnLeft,
    columnRight,
  } = gallery;

  return (
    <S.GallerySection id="gallery" aria-labelledby="gallery-heading">
      {/* Text content */}
      <S.GalleryHeader>
        <SectionTitle
          eyebrow={eyebrow}
          headingStart={headingStart}
          headingAccent={headingAccent}
          id="gallery-heading"
        />
        <S.Description>{description}</S.Description>

        <S.HighlightList aria-label="Gallery highlights">
          {highlights.map(({ id, Icon, label }) => (
            <S.HighlightItem key={id}>
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </S.HighlightItem>
          ))}
        </S.HighlightList>
      </S.GalleryHeader>

      {/* Scrolling image columns */}
      <S.GalleryColumns aria-label="Clinic gallery images">
        <InfiniteColumn images={columnLeft} direction="scroll-down" />
        <InfiniteColumn images={columnRight} direction="scroll-up" />
      </S.GalleryColumns>
    </S.GallerySection>
  );
};

export default memo(Gallery);