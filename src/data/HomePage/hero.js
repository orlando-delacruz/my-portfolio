import HeroBg from "../../assets/images/hero-bg.webp";
export const hero = {
  badge: "Trusted Dental Care",
  headingStart: "Healthy Smiles ",
  headingAccent: "Start Here",
  description:
    "We provide professional, gentle, and modern dental care for patients of all ages. From routine checkups to smile makeovers, our clinic is committed to helping you achieve a healthy and confident smile.",
  primaryCta: {
    label: "Book an Appointment",
    href: "#contact",
    ariaLabel: "Book a dental appointment",
  },
  secondaryCta: {
    label: "View Services",
    href: "#services",
    ariaLabel: "View our dental services",
  },
  image: {
    src: HeroBg,
    alt: "Dental clinic interior with a welcoming, modern environment",
  },
  stats: [
    {
      id: "experience",
      icon: "award",
      label: "5+ Years Experience",
    },
    {
      id: "rating",
      icon: "star",
      label: "4.9 Patient Rating",
    },
    {
      id: "patients",
      icon: "users",
      label: "1,000+ Happy Patients",
    },
  ],
};
