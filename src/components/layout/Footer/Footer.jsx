// src/components/layout/Footer/Footer.jsx
import { memo } from "react";
import { Alert } from "antd";
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoYoutube } from "react-icons/io5";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";
import * as S from "./Footer.styled";
import { useFooter } from "../../../hooks/cms/useFooter";
import Loading from "../../common/Loading";

// ── Social icon mapping ──
const SOCIAL_ICONS = {
  facebook: IoLogoFacebook,
  instagram: IoLogoInstagram,
  twitter: IoLogoTwitter,
  youtube: IoLogoYoutube,
};

// ── Contact icons mapping ──
const CONTACT_ICONS = {
  address: FiMapPin,
  phone: FiPhone,
  email: FiMail,
  hours: FiClock,
};

// ── Brand column ──
const BrandCol = memo(({ clinic_name, clinic_tagline, clinic_description, logo_url, social_links }) => (
  <S.BrandCol>
    <S.BrandRow>
      <S.BrandLogo src={logo_url || "/logo.webp"} alt={clinic_name} loading="lazy" width={50} height={50} />
      <S.BrandText>
        <S.BrandName>{clinic_name}</S.BrandName>
        {clinic_tagline && <S.BrandTagline>{clinic_tagline}</S.BrandTagline>}
      </S.BrandText>
    </S.BrandRow>

    {clinic_description && <S.BrandDesc>{clinic_description}</S.BrandDesc>}

    {social_links.length > 0 && (
      <S.SocialRow aria-label="Social media links">
        {social_links.map(({ id, url }) => {
          const Icon = SOCIAL_ICONS[id];
          return Icon ? (
            <S.SocialLink
              key={id}
              href={url}
              aria-label={id}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </S.SocialLink>
          ) : null;
        })}
      </S.SocialRow>
    )}
  </S.BrandCol>
));

BrandCol.displayName = "BrandCol";

// ── Quick links column ──
const QuickLinksCol = memo(({ quick_links }) => (
  <S.LinksCol aria-label="Quick navigation links">
    <S.ColHeading>Quick Links</S.ColHeading>
    {quick_links.map(({ label, href }) => (
      <S.FooterLink key={label} href={href}>
        {label}
      </S.FooterLink>
    ))}
  </S.LinksCol>
));

QuickLinksCol.displayName = "QuickLinksCol";

// ── Branches column ──
const BranchesCol = memo(({ branch_items }) => (
  <S.BranchesCol>
    <S.ColHeading>Our Branches</S.ColHeading>
    {branch_items.map(({ id, name, details }) => (
      <S.BranchBlock key={id}>
        <S.BranchName>{name}</S.BranchName>
        {details.map(({ id: detailId, value, href }) => {
          const Icon = CONTACT_ICONS[detailId] || FiMapPin;
          return (
            <S.DetailRow key={detailId}>
              <Icon aria-hidden="true" />
              {href ? <a href={href}>{value}</a> : <span>{value}</span>}
            </S.DetailRow>
          );
        })}
      </S.BranchBlock>
    ))}
  </S.BranchesCol>
));

BranchesCol.displayName = "BranchesCol";

// ── Contact column ──
const ContactCol = memo(({ address, phone, email, operating_hours }) => (
  <S.ContactCol>
    <S.ColHeading>Contact</S.ColHeading>
    {address && (
      <S.ContactRow>
        <FiMapPin aria-hidden="true" />
        <span>{address}</span>
      </S.ContactRow>
    )}
    {phone && (
      <S.ContactRow>
        <FiPhone aria-hidden="true" />
        <span>{phone}</span>
      </S.ContactRow>
    )}
    {email && (
      <S.ContactRow>
        <FiMail aria-hidden="true" />
        <span>{email}</span>
      </S.ContactRow>
    )}
    {operating_hours && (
      <S.ContactRow>
        <FiClock aria-hidden="true" />
        <span>{operating_hours}</span>
      </S.ContactRow>
    )}
  </S.ContactCol>
));

ContactCol.displayName = "ContactCol";

// ── Bottom bar ──
const FooterBottom = memo(({ copyright_text, clinic_name, legal_links }) => (
  <S.FooterBottom>
    <S.Copyright>{copyright_text || `© ${new Date().getFullYear()} ${clinic_name}. All Rights Reserved.`}</S.Copyright>
    {legal_links.length > 0 && (
      <S.LegalLinks>
        {legal_links.map(({ label, href }, index) => (
          <span
            key={label}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {index > 0 && <S.LegalSeparator aria-hidden="true">•</S.LegalSeparator>}
            <S.LegalLink href={href}>{label}</S.LegalLink>
          </span>
        ))}
      </S.LegalLinks>
    )}
  </S.FooterBottom>
));

FooterBottom.displayName = "FooterBottom";

// ── Main Footer component ──
const Footer = () => {
  const { data: footer, isLoading, error } = useFooter();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !footer) {
    return (
      <S.FooterWrapper id="footer" role="contentinfo">
        <Alert type="error" title="Failed to load footer content" showIcon />
      </S.FooterWrapper>
    );
  }

  const {
    clinic_name,
    clinic_tagline,
    clinic_description,
    logo_url,
    phone,
    email,
    address,
    operating_hours,
    social_links = [],
    quick_links = [],
    branch_items = [],
    legal_links = [],
    copyright_text,
  } = footer;

  return (
    <S.FooterWrapper id="footer" role="contentinfo">
      <S.FooterInner>
        <S.FooterGrid>
          <BrandCol
            clinic_name={clinic_name}
            clinic_tagline={clinic_tagline}
            clinic_description={clinic_description}
            logo_url={logo_url}
            social_links={social_links}
          />
          <QuickLinksCol quick_links={quick_links} />
          <BranchesCol branch_items={branch_items} />
          <ContactCol
            address={address}
            phone={phone}
            email={email}
            operating_hours={operating_hours}
          />
        </S.FooterGrid>
        <FooterBottom
          copyright_text={copyright_text}
          clinic_name={clinic_name}
          legal_links={legal_links}
        />
      </S.FooterInner>
    </S.FooterWrapper>
  );
};

export default memo(Footer);