// src/data/navbar.js
import Logo from "../assets/images/logo.png";

export const banner = {
  phone: { display: "(+63) 9123456789", href: "tel:+639123456789" },
  email: {
    display: "leidibuddentals@gmail.com",
    href: "mailto:leidibuddentals@gmail.com",
  },
  hours: "Mon–Fri: 9:00 AM – 5:00 PM",
  facebook: "#",
  instagram: "#",
};

export const navlivnks = [
  { label: "Home", href: "#home", active: true, hasDropdown: false },
  { label: "Services", href: "#services", active: false, hasDropdown: false },
  { label: "About", href: "#about", active: false, hasDropdown: false },
  { label: "Branches", href: "#branches", active: false, hasDropdown: false },
  { label: "Contact Us", href: "#footer", active: false, hasDropdown: false },
];

export const brand = {
  name: "Leidi Bud Dentals",
  tagline: "Trusted Dental Care",
  logoSrc: Logo,
  logoAlt: "Leidi Bud Dentals logo",
};
