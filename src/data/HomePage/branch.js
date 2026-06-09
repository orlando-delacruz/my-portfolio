import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiMail,
} from "react-icons/fi";

export const heading = {
  eyebrow: "Our Branches",
  headingStart: "Visit Our ",
  headingAccent: "Clinic Branches",
  headingId: "branches-heading",
};

export const branches = [
  {
    id: "main-branch",
    name: "Main Branch",
    location: "Rosario, Batangas",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247959.66812257585!2d121.10993008671875!3d13.816818399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd39f9f865e1ad%3A0xe31245bead75d6a7!2sLeidi%20Bud%20Dentals%20San%20Juan!5e0!3m2!1sen!2sph!4v1780987932087!5m2!1sen!2sph",
    contact: [
      { icon: FiMapPin, label: "Address", value: "R6QC+CCM, Rosario, Batangas" },
      { icon: FiPhone, label: "Phone", value: "(+63) 9123456789", href: "tel:+639123456789" },
      { icon: FiClock, label: "Hours", value: "Monday – Friday | 9:00 AM – 5:00 PM" },
      { icon: FiMail, label: "Email", value: "leidibuddentals@gmail.com", href: "mailto:leidibuddentals@gmail.com" },
    ],
    services: [
      "General Dentistry",
      "Cleaning",
      "Fillings",
      "Root Canal",
      "Pediatric Dentistry",
    ],
  },
  {
    id: "san-juan-branch",
    name: "San Juan Branch",
    location: "San Juan, Batangas",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d247936.4774073618!2d120.93264538671878!3d13.838590500000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33bd155b3294d3d9%3A0x1c174a010f66470e!2sLeidi%20Bud%20Dentals!5e0!3m2!1sen!2sph!4v1780987821188!5m2!1sen!2sph",
    contact: [
      { icon: FiMapPin, label: "Address", value: "R98X+P8G, San Juan - Laiya Rd, San Juan, Batangas" },
      { icon: FiPhone, label: "Phone", value: "(+63) 9123456789", href: "tel:+639123456789" },
      { icon: FiClock, label: "Hours", value: "Monday – Friday | 9:00 AM – 5:00 PM" },
      { icon: FiMail, label: "Email", value: "leidibuddentals@gmail.com", href: "mailto:leidibuddentals@gmail.com" },
    ],
    services: [
      "Braces",
      "Veneers",
      "Teeth Whitening",
      "Dental Implants",
      "Smile Makeover",
    ],
  },
];
