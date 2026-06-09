// src/data/HomePage/about.js
import AboutBg from "../../assets/images/about-bg.png"

import {
  FaUserFriends,
  FaTooth,
  FaTag,
  FaClinicMedical,
  FaHeart,
} from "react-icons/fa";

export const about = {
  eyebrow: "About Our Clinic",
  headingStart: "Comfortable Dental Care ",
  headingAccent: "You Can Trust",
  body: [
    "At Leidi Bud, we believe every patient deserves quality dental care in a welcoming and stress-free environment. Our team focuses on preventive, restorative, and cosmetic dentistry to help patients achieve healthy and confident smiles.",
    "We combine compassionate care with modern dental technology to provide safe, effective, and personalized treatments for every patient.",
  ],
  highlights: [
    { id: "team", Icon: FaUserFriends, label: "Friendly Dental Team" },
    { id: "equipment", Icon: FaTooth, label: "Modern Dental Equipment" },
    { id: "affordable", Icon: FaTag, label: "Affordable Treatment Options" },
    { id: "clean", Icon: FaClinicMedical, label: "Clean & Comfortable Clinics" },
    { id: "care", Icon: FaHeart, label: "Personalized Patient Care" },
  ],
  image: {
    src: AboutBg,
    alt: "Inside Leidi Bud dental clinic — bright, clean, and welcoming treatment room",
  },
};