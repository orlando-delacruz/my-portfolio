// src/components/layout/Header/Header.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./Header.styled";
import Button from "../../ui/Button";
import { AiOutlineMessage } from "react-icons/ai";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { IoLogoFacebook } from "react-icons/io5";
import { RiInstagramFill } from "react-icons/ri";
import { banner, navlivnks, brand } from "../../../data/navbar";
import { useHeader } from "./useHeader";

const Header = () => {
  const { links, setActive, mobileOpen, toggleMobile, closeMobile, scrolled } =
    useHeader(navlivnks);

  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/book");
    closeMobile();
  };

  return (
    <S.Header $scrolled={scrolled} role="banner">
      <S.Banner>
        <div className="left-details">
          <a className="contacts" href={banner.phone.href}>{banner.phone.display}</a>
          <a className="contacts" href={banner.email.href}>{banner.email.display}</a>
        </div>
        <div className="right-details">
          <p className="operating-hours">{banner.hours}</p>
          <a className="social-link" href={banner.facebook} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <IoLogoFacebook />
          </a>
          <a className="social-link" href={banner.instagram} aria-label="Instagram" target="_blank" rel="noopener noreferrer" >
            <RiInstagramFill />
          </a>
        </div>
      </S.Banner>

      {/* ── Navbar ── */}
      <S.Navbar>
        {/* Logo */}
        <S.LogoWrapper href="#home" aria-label={`${brand.name} — ${brand.tagline}`}>
          <S.LogoImage
            src={brand.logoSrc}
            alt={brand.logoAlt}
            width={39}
            height={65}
            loading="eager"
          />
          <S.LogoText>
            <S.LogoName>{brand.name}</S.LogoName>
            <S.LogoTagline>{brand.tagline}</S.LogoTagline>
          </S.LogoText>
        </S.LogoWrapper>

        {/* Desktop Nav Links */}
        <S.NavLinks role="menubar" aria-label="Primary navigation">
          {links.map((link) => (
            <S.NavItem key={link.href} role="none">
              <S.NavLink
                href={link.href}
                $active={link.active}
                role="menuitem"
                aria-current={link.active ? "page" : undefined}
                onClick={() => setActive(link.href)}
              >
                {link.label}
                {link.hasDropdown && (
                  <S.ChevronIcon aria-hidden="true">
                    <FiChevronDown />
                  </S.ChevronIcon>
                )}
              </S.NavLink>
            </S.NavItem>
          ))}

          {/* CTA */}
          <S.NavItem role="none">
            <Button
              variant="primary"
              size="sm"
              aria-label="Book an appointment"
              onClick={handleBookNow}
            >
              Book Now
              <AiOutlineMessage aria-hidden="true" />
            </Button>
          </S.NavItem>
        </S.NavLinks>

        {/* Mobile Hamburger */}
        <S.HamburgerButton
          onClick={toggleMobile}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </S.HamburgerButton>
      </S.Navbar>

      {/* ── Mobile Drawer ── */}
      <S.MobileDrawer id="mobile-menu" $open={mobileOpen} aria-hidden={!mobileOpen}>
        {links.map((link) => (
          <S.MobileNavLink
            key={link.href}
            href={link.href}
            $active={link.active}
            aria-current={link.active ? "page" : undefined}
            onClick={() => {
              setActive(link.href);
              closeMobile();
            }}
          >
            {link.label}
            {link.hasDropdown && <FiChevronDown aria-hidden="true" />}
          </S.MobileNavLink>
        ))}

        <S.MobileBookButton>
          <Button
            variant="primary"
            size="sm"
            aria-label="Book an appointment"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleBookNow}
          >
            Book Now
            <AiOutlineMessage aria-hidden="true" />
          </Button>
        </S.MobileBookButton>
      </S.MobileDrawer>
    </S.Header>
  );
};

export default memo(Header);