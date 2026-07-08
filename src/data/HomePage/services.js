// src/data/HomePage/services.js

const rosarioServices = [
  {
    id: "consultation",
    title: "Consultation",
    titleTl: "Konsultasyon",
    starting_price: 300,
    maximum_price: 500,
    shortDesc: "Professional dental consultation and oral examination.",
    fullDesc:
      "Receive a comprehensive dental consultation, oral examination, and professional recommendations regarding your oral health.",
    image: "https://picsum.photos/seed/consultation/600/300",
    imageAlt: "Dental consultation",
  },
  {
    id: "consultation-certificate",
    title: "Consultation with Dental Certificate and/or Treatment Plan",
    titleTl: "Konsultasyon na may Dental Certificate o Treatment Plan",
    starting_price: 500,
    maximum_price: 500,
    shortDesc:
      "Dental consultation with an official certificate and/or treatment plan.",
    fullDesc:
      "Includes a comprehensive dental examination along with a dental certificate and/or a detailed treatment plan based on the dentist's assessment.",
    image: "https://picsum.photos/seed/certificate/600/300",
    imageAlt: "Dental certificate consultation",
  },
  {
    id: "fluoride-application",
    title: "Topical Fluoride Application",
    titleTl: "Fluoride Application",
    starting_price: 1000,
    maximum_price: 1000,
    shortDesc:
      "Professional fluoride treatment to strengthen teeth and prevent cavities.",
    fullDesc:
      "A fluoride treatment that helps strengthen enamel, reduce tooth sensitivity, and prevent cavities for both children and adults.",
    image: "https://picsum.photos/seed/fluoride/600/300",
    imageAlt: "Topical fluoride application",
  },
  {
    id: "oral-prophylaxis",
    title: "Oral Prophylaxis",
    titleTl: "Paglilinis ng Ngipin",
    starting_price: 1000,
    maximum_price: 3500,
    shortDesc:
      "Professional teeth cleaning based on the severity of plaque and tartar buildup.",
    fullDesc:
      "Oral prophylaxis removes plaque, tartar, and stains to maintain healthy gums and teeth.\n\nPricing:\n• Mild – ₱1,000–₱1,500\n• Moderate – ₱2,000–₱2,500\n• Heavy/Severe – ₱3,000–₱3,500",
    image: "https://picsum.photos/seed/prophylaxis/600/300",
    imageAlt: "Professional teeth cleaning",
  },
  {
    id: "perio-case",
    title: "Perio Case",
    titleTl: "Paggamot sa Gilagid",
    starting_price: 3500,
    maximum_price: 4500,
    shortDesc: "Treatment for gum disease and advanced periodontal conditions.",
    fullDesc:
      "Periodontal treatment focuses on managing gum disease through deep cleaning and specialized procedures to restore healthy gums.",
    image: "https://picsum.photos/seed/perio/600/300",
    imageAlt: "Periodontal treatment",
  },
  {
    id: "tooth-extraction",
    title: "Tooth Extraction",
    titleTl: "Pagbubunot ng Ngipin",
    starting_price: 1000,
    maximum_price: 3500,
    shortDesc: "Safe and comfortable tooth extraction procedures.",
    fullDesc:
      "Extraction services include:\n\n• Simple Extraction (Pedo/Adult) – ₱1,000\n• Complicated Extraction – ₱1,500–₱2,500\n• Erupted Wisdom Tooth Extraction – ₱1,500–₱3,500",
    image: "https://picsum.photos/seed/extraction/600/300",
    imageAlt: "Tooth extraction",
  },
  {
    id: "dental-suture",
    title: "Dental Suture",
    titleTl: "Dental Suture",
    starting_price: 350,
    maximum_price: 350,
    shortDesc: "Dental suturing after oral surgical procedures.",
    fullDesc:
      "Dental sutures are placed after tooth extractions or oral surgery to promote proper healing and protect the surgical site.",
    image: "https://picsum.photos/seed/suture/600/300",
    imageAlt: "Dental suture",
  },
];

const sanJuanServices = [
  ...rosarioServices,

  {
    id: "periapical-xray",
    title: "Periapical X-Ray",
    titleTl: "Periapical X-Ray",
    starting_price: 400,
    maximum_price: 400,
    shortDesc: "Detailed dental X-ray for accurate diagnosis.",
    fullDesc:
      "A periapical X-ray provides a detailed image of the entire tooth and surrounding bone, helping diagnose infections, fractures, and other dental conditions.",
    image: "https://picsum.photos/seed/xray/600/300",
    imageAlt: "Periapical dental x-ray",
  },
  {
    id: "tooth-restoration",
    title: "Tooth Restoration",
    titleTl: "Pagpapaayos ng Ngipin",
    starting_price: 1000,
    maximum_price: 2500,
    shortDesc: "Composite restorations for decayed or damaged teeth.",
    fullDesc:
      "Pricing depends on the type and severity of the cavity.\n\n• Class I (Incipient) – ₱1,000\n• Class I (Advanced) – ₱1,500\n• Class II (Incipient) – ₱1,500\n• Class II (Advanced) – ₱2,000\n• Class III – ₱1,000–₱1,500\n• Class IV Carious Lesion – ₱1,500–₱2,500\n• Class IV Fractured – ₱2,000–₱2,500\n• Class V Carious Lesion/Abrasion – ₱1,000",
    image: "https://picsum.photos/seed/restoration/600/300",
    imageAlt: "Tooth restoration",
  },
  {
    id: "lstr",
    title: "LSTR Cases",
    titleTl: "LSTR Cases",
    starting_price: 1500,
    maximum_price: 1500,
    shortDesc: "Lesion Sterilization and Tissue Repair treatment.",
    fullDesc:
      "LSTR is a minimally invasive treatment used to disinfect infected primary teeth while preserving their structure.",
    image: "https://picsum.photos/seed/lstr/600/300",
    imageAlt: "LSTR treatment",
  },
  {
    id: "temporary-filling",
    title: "Temporary Filling (IRM)",
    titleTl: "Pansamantalang Pasta (IRM)",
    starting_price: 1000,
    maximum_price: 1000,
    shortDesc: "Temporary filling used before permanent restoration.",
    fullDesc:
      "IRM temporary fillings protect the tooth while waiting for permanent treatment or further procedures.",
    image: "https://picsum.photos/seed/irm/600/300",
    imageAlt: "Temporary dental filling",
  },
  {
    id: "permanent-composite",
    title: "Permanent Composite Filling",
    titleTl: "Permanenteng Composite Filling",
    starting_price: 1500,
    maximum_price: 2000,
    shortDesc: "Permanent tooth-colored filling after LSTR or IRM.",
    fullDesc:
      "A durable composite resin restoration placed after LSTR or temporary filling treatment to restore function and appearance.",
    image: "https://picsum.photos/seed/composite/600/300",
    imageAlt: "Composite filling",
  },
  {
    id: "composite-build-up",
    title: "Composite Build-Up",
    titleTl: "Composite Build-Up",
    starting_price: 2000,
    maximum_price: 2500,
    shortDesc: "Rebuild damaged tooth structure using composite resin.",
    fullDesc:
      "Composite build-up restores severely damaged teeth by rebuilding lost tooth structure using high-quality tooth-colored composite material.",
    image: "https://picsum.photos/seed/buildup/600/300",
    imageAlt: "Composite build up",
  },
];

export const services = {
  eyebrow: "Services",
  headingStart: "Dental Services ",
  headingAccent: "We Offer",
  viewAllLabel: "View All Services",
  initialCount: 6,
  branches: [
    {
      id: "rosario",
      label: "Rosario Branch",
      items: rosarioServices,
    },
    {
      id: "sanjuan",
      label: "San Juan Branch",
      items: sanJuanServices,
    },
  ],
};