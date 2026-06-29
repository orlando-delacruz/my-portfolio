// src/data/footer.js
import { IoLogoFacebook } from "react-icons/io5";
import { RiInstagramFill } from "react-icons/ri";
import { FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMapPin, FiClock, FiPhone, FiMail } from "react-icons/fi";
import Logo from "../assets/images/logo.webp";

export const footer = {
  brand: {
    logoSrc: Logo,
    logoAlt: "Leidi Bud Dentals logo",
    name: "Leidi Bud Dentals",
    tagline: "Trusted Dental Clinic",
    description:
      "Providing comprehensive dental care through modern technology, experienced professionals, and personalized treatment plans. We are committed to helping every patient achieve optimal oral health in a comfortable and welcoming environment.",
  },

  socials: [
    { id: "facebook", Icon: IoLogoFacebook, href: "#", label: "Facebook" },
    { id: "instagram", Icon: RiInstagramFill, href: "#", label: "Instagram" },
    { id: "twitter", Icon: FaTwitter, href: "#", label: "Twitter" },
    { id: "youtube", Icon: FaYoutube, href: "#", label: "YouTube" },
  ],

  quickLinks: [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Why Us?", href: "#why-us" },
    { label: "Branches", href: "#branches" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact Us", href: "#contact" },
  ],

  branches: [
    {
      id: "rosario",
      name: "Main Branch",
      details: [
        { id: "address", Icon: FiMapPin, text: "R6QC+CCM, Rosario, Batangas" },
        { id: "hours", Icon: FiClock, text: "Mon – Fri: 9:00 AM – 6:00 PM" },
        {
          id: "phone",
          Icon: FiPhone,
          text: "+63 9123456789",
          href: "tel:+639123456789",
        },
      ],
    },
    {
      id: "sanjuan",
      name: "San Juan Branch",
      details: [
        {
          id: "address",
          Icon: FiMapPin,
          text: "R98X+P8G, San Juan - Laiya Rd, San Juan, Batangas",
        },
        { id: "hours", Icon: FiClock, text: "Mon – Fri: 9:00 AM – 6:00 PM" },
        {
          id: "phone",
          Icon: FiPhone,
          text: "+63 9123456789",
          href: "tel:+639123456789",
        },
      ],
    },
  ],

  contact: [
    { id: "address", Icon: FiMapPin, text: "Rosario, Batangas, Philippines" },
    {
      id: "phone",
      Icon: FiPhone,
      text: "+63 9123456789",
      href: "tel:+639123456789",
    },
    {
      id: "email",
      Icon: FiMail,
      text: "leidibuddentals@gmail.com",
      href: "mailto:leidibuddentals@gmail.com",
    },
  ],

  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Sitemap", href: "#" },
  ],

  copyright: "© 2026 Leidi Bud Dentals. All Rights Reserved.",
};
