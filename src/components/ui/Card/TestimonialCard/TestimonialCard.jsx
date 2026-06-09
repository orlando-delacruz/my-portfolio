import { memo } from "react";
import { FaStar } from "react-icons/fa";
import * as S from "./TestimonialCard.styled";

/**
 * TestimonialCard
 *
 * @param {object}  testimonial  - Testimonial data object
 * @param {boolean} $featured    - When true renders the larger centre variant
 */
const TestimonialCard = memo(({ testimonial, $featured = false }) => {
  const { quote, name, service, rating, avatar } = testimonial;

  return (
    <S.Card $featured={$featured} role="article" aria-label={`Testimonial from ${name}`}>
      <S.Quote $featured={$featured}>"{quote}"</S.Quote>

      <S.Avatar
        src={avatar}
        alt={`Photo of ${name}`}
        width={100}
        height={100}
        loading="lazy"
      />

      <S.Meta>
        <S.PatientName $featured={$featured}>{name}</S.PatientName>
        <S.ServiceLabel $featured={$featured}>{service}</S.ServiceLabel>

        <S.StarRow role="img" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: rating }).map((_, i) => (
            <FaStar key={i} aria-hidden="true" />
          ))}
        </S.StarRow>
      </S.Meta>
    </S.Card>
  );
});

TestimonialCard.displayName = "TestimonialCard";
export default TestimonialCard;
