// src/components/ui/Card/ServiceCard.jsx
import { memo } from "react";
import { FiArrowRight } from "react-icons/fi";
import * as S from "./ServiceCard.styled";

const formatPrice = (starting, maximum) => {
  if (starting === undefined || starting === null) return null;
  const start = Number(starting);
  const max = Number(maximum);
  if (start === max) return `₱${start.toLocaleString()}`;
  return `₱${start.toLocaleString()} – ₱${max.toLocaleString()}`;
};

const ServiceCard = memo(({ service, onViewDetails }) => {
  const {
    title,
    titleTl,
    shortDesc,
    image,
    imageAlt,
    starting_price,
    maximum_price,
  } = service;

  const priceDisplay = formatPrice(starting_price, maximum_price);

  const handleCardClick = () => {
    onViewDetails(service);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    onViewDetails(service);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <S.Card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <S.ImageWrapper>
        {image ? (
          <S.CardImage src={image} alt={imageAlt || title} loading="lazy" decoding="async" />
        ) : (
          <div style={{ height: 180, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, color: '#aaa' }}>
            No Image
          </div>
        )}
        {priceDisplay && <S.PriceBadge>{priceDisplay}</S.PriceBadge>}
      </S.ImageWrapper>
      <S.CardBody>
        <S.CardTextGroup>
          <S.TitleGroup>
            <S.CardTitle>{title}</S.CardTitle>
            {titleTl && <S.CardTitleTl>{titleTl}</S.CardTitleTl>}
          </S.TitleGroup>
          <S.CardDesc>{shortDesc}</S.CardDesc>
        </S.CardTextGroup>

        <S.ButtonRow>
          <S.ViewDetailsButton onClick={handleButtonClick}>
            View Details <FiArrowRight aria-hidden="true" />
          </S.ViewDetailsButton>
        </S.ButtonRow>
      </S.CardBody>
    </S.Card>
  );
});

ServiceCard.displayName = "ServiceCard";
export default ServiceCard;