// src/components/ui/Card/ServiceCard.jsx
import { memo } from "react";
import { FiArrowRight } from "react-icons/fi";
import * as S from "./ServiceCard.styled";

const ServiceCard = memo(({ service, onViewDetails }) => {
  const { title, titleTl, shortDesc, image, imageAlt, price } = service;

  return (
    <S.Card>
      <S.ImageWrapper>
        <S.CardImage
          src={image}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          width={600}
          height={300}
        />
        <S.PriceBadge>
          {price
            ? `Starts at ₱${price.toLocaleString("en-PH")}`
            : "Contact for pricing"}
        </S.PriceBadge>
      </S.ImageWrapper>
      <S.CardBody>
        <S.CardTextGroup>
          <S.TitleGroup>
            <S.CardTitle>{title}</S.CardTitle>
            {titleTl && <S.CardTitleTl>{titleTl}</S.CardTitleTl>}
          </S.TitleGroup>
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