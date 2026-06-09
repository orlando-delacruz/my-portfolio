// src/components/layout/Footer/Footer.styled.js
import styled from "styled-components";
import theme from "../../../styles/theme";

/* ─── Outer footer ────────────────────────────────────── */
export const FooterWrapper = styled.footer`
  background: ${theme.colors.white};
  box-shadow: 1px -5px 5px 1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const FooterInner = styled.div`
  padding: 80px 65px 0;
  display: flex;
  flex-direction: column;
  gap: 50px;

  @media ${theme.media.tablet} {
    padding: 60px 30px 0;
    gap: 40px;
  }

  @media ${theme.media.mobile} {
    padding: 50px 20px 0;
    gap: 32px;
  }
`;

/* ─── 4-column grid ───────────────────────────────────── */
export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 1fr 1.4fr 1fr;
  gap: 40px;
  align-items: start;

  @media ${theme.media.tablet} {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  @media ${theme.media.mobile} {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

/* ─── Column heading ──────────────────────────────────── */
export const ColHeading = styled.h3`
  font-size: 22px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
  line-height: 1.5;
  margin: 0 0 10px;
`;

/* ─── Col 1 — Brand ───────────────────────────────────── */
export const BrandCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BrandLogo = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BrandName = styled.span`
  font-size: 20px;
  font-weight: ${theme.typography.weight.semibold};
  color: ${theme.colors.primary};
  line-height: 1.5;
`;

export const BrandTagline = styled.span`
  font-size: 10px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
  line-height: 1.5;
`;

export const BrandDesc = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.primary};
  line-height: 1.6;
  margin: 0;
  opacity: 0.85;
`;

export const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SocialLink = styled.a`
  color: ${theme.colors.primary};
  font-size: 22px;
  display: inline-flex;
  align-items: center;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover {
    opacity: 0.7;
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

/* ─── Col 2 — Quick links ─────────────────────────────── */
export const LinksCol = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FooterLink = styled.a`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.primary};
  line-height: 1.5;
  padding: 3px 0;
  text-decoration: none;
  transition: opacity 0.15s ease;
  width: fit-content;

  &:hover {
    opacity: 0.65;
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

/* ─── Col 3 — Branches ────────────────────────────────── */
export const BranchesCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const BranchBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const BranchName = styled.span`
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.primary};
  line-height: 1.5;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.body};
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    font-size: 18px;
    margin-top: 2px;
    color: ${theme.colors.primary};
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/* ─── Col 4 — Contact ─────────────────────────────────── */
export const ContactCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 5px;
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.sm};
  line-height: 1.6;

  svg {
    flex-shrink: 0;
    font-size: 16px;
    margin-top: 3px;
    color: ${theme.colors.primary};
  }

  a {
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

/* ─── Bottom bar ──────────────────────────────────────── */
export const FooterBottom = styled.div`
  padding: 14px 10px;
  border-top: 1px solid ${theme.colors.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  @media ${theme.media.mobile} {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
  }
`;

export const Copyright = styled.p`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.primary};
  margin: 0;
  line-height: 1.5;
`;

export const LegalLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegalLink = styled.a`
  font-size: ${theme.typography.size.sm};
  color: ${theme.colors.primary};
  text-decoration: none;
  line-height: 1.5;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const LegalSeparator = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.sm};
  opacity: 0.5;
  user-select: none;
`;
