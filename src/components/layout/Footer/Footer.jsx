// src/components/layout/Footer/Footer.jsx
import { memo } from "react";
import * as S from "./Footer.styled";
import { footer } from "../../../data/footer";

/* ─── Brand column ────────────────────────────────────── */
const BrandCol = memo(() => {
  const { brand, socials } = footer;
  return (
    <S.BrandCol>
      <S.BrandRow>
        <S.BrandLogo src={brand.logoSrc} alt={brand.logoAlt} loading="lazy" width={50} height={50} />
        <S.BrandText>
          <S.BrandName>{brand.name}</S.BrandName>
          <S.BrandTagline>{brand.tagline}</S.BrandTagline>
        </S.BrandText>
      </S.BrandRow>

      <S.BrandDesc>{brand.description}</S.BrandDesc>

      <S.SocialRow aria-label="Social media links">
        {socials.map(({ id, Icon, href, label }) => (
          <S.SocialLink key={id} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
            <Icon aria-hidden="true" />
          </S.SocialLink>
        ))}
      </S.SocialRow>
    </S.BrandCol>
  );
});
BrandCol.displayName = "BrandCol";

/* ─── Quick links column ──────────────────────────────── */
const QuickLinksCol = memo(() => (
  <S.LinksCol aria-label="Quick navigation links">
    <S.ColHeading>Quick Links</S.ColHeading>
    {footer.quickLinks.map(({ label, href }) => (
      <S.FooterLink key={href} href={href}>
        {label}
      </S.FooterLink>
    ))}
  </S.LinksCol>
));
QuickLinksCol.displayName = "QuickLinksCol";

/* ─── Branches column ─────────────────────────────────── */
const BranchesCol = memo(() => (
  <S.BranchesCol>
    <S.ColHeading>Our Branches</S.ColHeading>
    {footer.branches.map(({ id, name, details }) => (
      <S.BranchBlock key={id}>
        <S.BranchName>{name}</S.BranchName>
        {details.map(({ id: detailId, Icon, text, href }) => (
          <S.DetailRow key={detailId}>
            <Icon aria-hidden="true" />
            {href ? <a href={href}>{text}</a> : <span>{text}</span>}
          </S.DetailRow>
        ))}
      </S.BranchBlock>
    ))}
  </S.BranchesCol>
));
BranchesCol.displayName = "BranchesCol";

/* ─── Contact column ──────────────────────────────────── */
const ContactCol = memo(() => (
  <S.ContactCol>
    <S.ColHeading>Contact</S.ColHeading>
    {footer.contact.map(({ id, Icon, text, href }) => (
      <S.ContactRow key={id}>
        <Icon aria-hidden="true" />
        {href ? <a href={href}>{text}</a> : <span>{text}</span>}
      </S.ContactRow>
    ))}
  </S.ContactCol>
));
ContactCol.displayName = "ContactCol";

/* ─── Bottom bar ──────────────────────────────────────── */
const FooterBottom = memo(() => (
  <S.FooterBottom>
    <S.Copyright>{footer.copyright}</S.Copyright>
    <S.LegalLinks>
      {footer.legal.map(({ label, href }, i) => (
        <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {i > 0 && <S.LegalSeparator aria-hidden="true">•</S.LegalSeparator>}
          <S.LegalLink href={href}>{label}</S.LegalLink>
        </span>
      ))}
    </S.LegalLinks>
  </S.FooterBottom>
));
FooterBottom.displayName = "FooterBottom";

/* ─── Main component ──────────────────────────────────── */
const Footer = () => (
  <S.FooterWrapper id="footer" role="contentinfo">
    <S.FooterInner>
      <S.FooterGrid>
        <BrandCol />
        <QuickLinksCol />
        <BranchesCol />
        <ContactCol />
      </S.FooterGrid>
      <FooterBottom />
    </S.FooterInner>
  </S.FooterWrapper>
);

export default memo(Footer);