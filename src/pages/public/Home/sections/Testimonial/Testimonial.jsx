import { memo, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import SectionTitle from "../../../../../components/common/SectionTitle";
import TestimonialCard from "../../../../../components/ui/Card/TestimonialCard";
import { testimonials, heading } from "../../../../../data/HomePage/testimonials";
import * as S from "./Testimonial.styled";

const getVisibleIndices = (active, total) => {
  const left = (active - 1 + total) % total;
  const right = (active + 1) % total;
  return [left, active, right];
};

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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