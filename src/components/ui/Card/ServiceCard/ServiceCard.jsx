// src/components/ui/Card/ServiceCard.jsx
import { memo } from "react";
import { FiArrowRight } from "react-icons/fi";
import * as S from "./ServiceCard.styled";

const ServiceCard = memo(({ service, onViewDetails }) => {
  const { title, shortDesc, image, imageAlt } = service;

  return (
    <S.Card>
      <S.CardImage
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        width={600}
        height={300}
      />
      <S.CardBody>
        <S.CardTextGroup>
          <S.CardTitle>{title}</S.CardTitle>
          <S.CardDesc>{shortDesc}</S.CardDesc>
        </S.CardTextGroup>
        <S.ViewDetailsButton
          onClick={() => onViewDetails(service)}
          aria-label={`View details for ${title}`}
        >
          View Details
          <FiArrowRight aria-hidden="true" />
        </S.ViewDetailsButton>
      </S.CardBody>
    </S.Card>
  );
});

ServiceCard.displayName = "ServiceCard";
export default ServiceCard;