// src/data/HomePage/whyUs.js
import { FaUserMd, FaTooth, FaCouch, FaTag, FaShieldAlt, FaCalendarCheck } from "react-icons/fa";

export const whyUs = {
  eyebrow: "Why Us?",
  headingStart: "Why Patients Choose ",
  headingAccent: "Leidi Bud",
  cards: [
    {
      id: "experienced-dentists",
      Icon: FaUserMd,
      title: "Experienced Dentists",
      description:
        "Our dental professionals are trained to provide accurate diagnosis and high-quality treatment.",
    },
    {
      id: "modern-technology",
      Icon: FaTooth,
      title: "Modern Technology",
      description:
        "We use updated dental equipment and techniques for safer and more effective procedures.",
    },
    {
      id: "comfortable-experience",
      Icon: FaCouch,
      title: "Comfortable Experience",
      description:
        "We create a relaxing and patient-friendly environment to reduce dental anxiety.",
    },
    {
      id: "affordable-care",
      Icon: FaTag,
      title: "Affordable Care",
      description:
        "We offer quality dental services with transparent and reasonable pricing.",
    },
    {
      id: "sterile-facilities",
      Icon: FaShieldAlt,
      title: "Sterile Facilities",
      description:
        "Our clinic follows proper sanitation and sterilization standards for patient safety.",
    },
    {
      id: "convenient-scheduling",
      Icon: FaCalendarCheck,
      title: "Convenient Scheduling",
      description:
        "Flexible appointment scheduling designed to fit your busy lifestyle.",
    },
  ],
};