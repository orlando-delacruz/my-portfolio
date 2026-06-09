// src/data/HomePage/gallery.js
import { MdOutlineCleaningServices } from "react-icons/md";
import { GiTooth } from "react-icons/gi";
import { FaUserMd, FaCouch } from "react-icons/fa";
import { RiHeartPulseLine } from "react-icons/ri";

export const gallery = {
  eyebrow: "Our Gallery",
  headingStart: "Leidi Bud Dentals ",
  headingAccent: "Gallery",
  description:
    "Step inside our dental clinic and explore the spaces, technology, and people dedicated to creating healthier and more confident smiles.",
  highlights: [
    { id: "facilities", Icon: MdOutlineCleaningServices, label: "Modern & Sterile Facilities" },
    { id: "technology", Icon: GiTooth, label: "Advanced Dental Technology" },
    { id: "professionals", Icon: FaUserMd, label: "Experienced Dental Professionals" },
    { id: "environment", Icon: FaCouch, label: "Comfortable Patient Environment" },
    { id: "care", Icon: RiHeartPulseLine, label: "Personalized Dental Care" },
  ],
  // Two independent columns — each array is duplicated in the component for seamless looping
  columnLeft: [
    { id: "l1", src: "https://picsum.photos/seed/gallery-l1/480/370", alt: "Dental clinic reception area" },
    { id: "l2", src: "https://picsum.photos/seed/gallery-l2/480/320", alt: "Modern dental treatment room" },
    { id: "l3", src: "https://picsum.photos/seed/gallery-l3/480/330", alt: "Dental team at work" },
    { id: "l4", src: "https://picsum.photos/seed/gallery-l4/480/330", alt: "Sterilisation and equipment area" },
  ],
  columnRight: [
    { id: "r1", src: "https://picsum.photos/seed/gallery-r1/480/200", alt: "Patient consultation session" },
    { id: "r2", src: "https://picsum.photos/seed/gallery-r2/480/350", alt: "Dental X-ray equipment" },
    { id: "r3", src: "https://picsum.photos/seed/gallery-r3/480/300", alt: "Comfortable waiting area" },
    { id: "r4", src: "https://picsum.photos/seed/gallery-r4/480/300", alt: "Children dental care room" },
  ],
};