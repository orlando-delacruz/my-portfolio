import { memo, useCallback, useId } from "react";
import { FiArrowRight } from "react-icons/fi";
import * as S from "./BranchCard.styled";

/**
 * BranchCard
 *
 * @param {object}   branch   - Branch data object
 * @param {function} onOpen   - Callback fired when card or "View Details" is clicked
 */
const BranchCard = memo(({ branch, onOpen }) => {
  const cardId = useId();
  const headingId = `${cardId}-heading`;

  const handleOpen = useCallback(() => onOpen(branch), [branch, onOpen]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen]
  );

  return (
    <S.Card
      role="article"
      aria-labelledby={headingId}
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
    >
      {/* Map Preview */}
      <S.MapFrame
        src={branch.mapSrc}
        title={`Map of ${branch.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={`Google Maps showing ${branch.name} in ${branch.location}`}
        style={{ pointerEvents: "none" }}
      />

      {/* Branch Name */}
      <S.CardName id={headingId}>
        {branch.name} — {branch.location}
      </S.CardName>

      {/* Contact Info */}
      <S.CardBlock>
        <S.BlockLabel>Contact Info</S.BlockLabel>
        {branch.contact.map(({ icon: Icon, label, value, href }) => (
          <S.ContactRow key={label}>
            <S.ContactIcon aria-hidden="true">
              <Icon />
            </S.ContactIcon>
            {href ? (
              <a
                href={href}
                aria-label={`${label}: ${value}`}
                onClick={(e) => e.stopPropagation()}
              >
                {value}
              </a>
            ) : (
              <span>{value}</span>
            )}
          </S.ContactRow>
        ))}
      </S.CardBlock>

      {/* Available Services */}
      <S.CardBlock>
        <S.BlockLabel>Available Services</S.BlockLabel>
        <S.ServiceList role="list" aria-label={`Services at ${branch.name}`}>
          {branch.services.map((service) => (
            <S.ServiceItem key={service} role="listitem">
              {service}
            </S.ServiceItem>
          ))}
        </S.ServiceList>
      </S.CardBlock>

      {/* View Details CTA */}
      <S.ViewDetailsRow>
        <S.ViewDetailsBtn
          aria-label={`View details for ${branch.name}`}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          View Details
          <FiArrowRight aria-hidden="true" />
        </S.ViewDetailsBtn>
      </S.ViewDetailsRow>
    </S.Card>
  );
});

BranchCard.displayName = "BranchCard";
export default BranchCard;
