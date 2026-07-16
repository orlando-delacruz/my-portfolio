// src/pages/public/Home/sections/Testimonial/Testimonial.jsx
import { memo, useState, useCallback, useMemo } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Alert } from "antd";

import SectionTitle from "../../../../../components/common/SectionTitle";
import TestimonialCard from "../../../../../components/ui/Card/TestimonialCard";
import Loading from "../../../../../components/common/Loading";
import { useTestimonials } from "../../../../../hooks/cms/useTestimonials";
import { generateAvatarDataUrl } from "../../../../../utils/avatarGenerator";
import * as S from "./Testimonial.styled";

const getVisibleIndices = (active, total) => {
  if (total === 0) return [];
  const left = (active - 1 + total) % total;
  const right = (active + 1) % total;
  return [left, active, right];
};

const Testimonial = () => {
  const { data: section, isLoading, error } = useTestimonials();
  const [activeIndex, setActiveIndex] = useState(0);

  // Transform section data
  const { heading, testimonials } = useMemo(() => {
    if (!section) {
      return { heading: null, testimonials: [] };
    }
    const { pre_title, title, highlight_text, items = [] } = section;
    const transformed = items.map((item) => {
      const avatarDataUrl = generateAvatarDataUrl(item.name);
      return {
        id: item.id,
        quote: item.quote,
        name: item.name,
        service: item.service || "",
        rating: item.rating,
        avatar: avatarDataUrl,
      };
    });
    return {
      heading: {
        eyebrow: pre_title,
        headingStart: title,
        headingAccent: highlight_text,
        headingId: "testimonials-heading",
      },
      testimonials: transformed,
    };
  }, [section]);

  // ✅ Move total calculation BEFORE useCallback hooks that depend on it
  const total = testimonials.length;

  const handlePrev = useCallback(
    () => setActiveIndex((prev) => (prev - 1 + total) % total),
    [total]
  );

  const handleNext = useCallback(
    () => setActiveIndex((prev) => (prev + 1) % total),
    [total]
  );

  const handleDot = useCallback((index) => setActiveIndex(index), []);

  // Early returns
  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !section) {
    return (
      <S.Section id="testimonials" aria-labelledby="testimonials-heading">
        <Alert type="error" title="Failed to load testimonials" showIcon />
      </S.Section>
    );
  }

  if (total === 0) {
    return (
      <S.Section id="testimonials" aria-labelledby="testimonials-heading">
        <SectionTitle
          eyebrow={heading.eyebrow}
          headingStart={heading.headingStart}
          headingAccent={heading.headingAccent}
          id={heading.headingId}
        />
        <S.EmptyState>No testimonials available at the moment.</S.EmptyState>
      </S.Section>
    );
  }

  const [leftIdx, centerIdx, rightIdx] = getVisibleIndices(activeIndex, total);

  return (
    <S.Section id="testimonials" aria-labelledby={heading.headingId}>
      <SectionTitle
        eyebrow={heading.eyebrow}
        headingStart={heading.headingStart}
        headingAccent={heading.headingAccent}
        id={heading.headingId}
      />

      <S.CarouselWrapper
        role="region"
        aria-label="Patient testimonials carousel"
        aria-roledescription="carousel"
      >
        <S.CarouselTrack>
          <TestimonialCard testimonial={testimonials[leftIdx]} $featured={false} />
          <TestimonialCard testimonial={testimonials[centerIdx]} $featured={true} />
          <TestimonialCard testimonial={testimonials[rightIdx]} $featured={false} />
        </S.CarouselTrack>
      </S.CarouselWrapper>

      <S.NavRow>
        <S.NavButton onClick={handlePrev} aria-label="Previous testimonial">
          <FiChevronLeft aria-hidden="true" />
        </S.NavButton>
        <S.NavButton onClick={handleNext} aria-label="Next testimonial">
          <FiChevronRight aria-hidden="true" />
        </S.NavButton>
      </S.NavRow>

      <S.DotRow role="tablist" aria-label="Testimonial navigation dots">
        {testimonials.map((t, i) => (
          <S.Dot
            key={t.id}
            role="tab"
            $active={i === activeIndex}
            aria-selected={i === activeIndex}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => handleDot(i)}
          />
        ))}
      </S.DotRow>
    </S.Section>
  );
};

export default memo(Testimonial);