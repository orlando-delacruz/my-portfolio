// src/services/cms/footer.js
import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const TABLE = "cms_footer";

/**
 * Fetch the Footer record (creates default if none exists).
 */
export async function fetchFooter() {
  const { data: footer, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!footer) {
    // Create default Footer
    const defaultFooter = {
      clinic_name: "Leidi Bud Dentals",
      clinic_tagline: "Trusted Dental Clinic",
      clinic_description:
        "Providing comprehensive dental care through modern technology, experienced professionals, and personalized treatment plans. We are committed to helping every patient achieve optimal oral health in a comfortable and welcoming environment.",
      logo_url: "/logo.webp",
      phone: "+63 9123456789",
      email: "leidibuddentals@gmail.com",
      address: "Rosario, Batangas, Philippines",
      operating_hours: "Mon–Fri: 9:00 AM – 5:00 PM",
      social_links: [
        {
          id: "facebook",
          platform: "Facebook",
          url: "https://www.facebook.com/Leidi.Bud.Dentals",
        },
        {
          id: "instagram",
          platform: "Instagram",
          url: "https://www.instagram.com/leidi_bud_dentals/",
        },
      ],
      quick_links: [
        { label: "Home", href: "#home" },
        { label: "About Us", href: "#about" },
        { label: "Services", href: "#services" },
        { label: "Gallery", href: "#gallery" },
        { label: "Why Us?", href: "#why-us" },
        { label: "Branches", href: "#branches" },
        { label: "Testimonials", href: "#testimonials" },
        { label: "FAQs", href: "#faqs" },
        { label: "Contact Us", href: "#footer" },
      ],
      branch_items: [
        {
          id: "rosario",
          name: "Main Branch",
          details: [
            {
              id: "address",
              label: "Address",
              value: "R6QC+CCM, Rosario, Batangas",
            },
            {
              id: "hours",
              label: "Hours",
              value: "Mon – Fri: 9:00 AM – 6:00 PM",
            },
            {
              id: "phone",
              label: "Phone",
              value: "+63 9123456789",
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
              label: "Address",
              value: "R98X+P8G, San Juan - Laiya Rd, San Juan, Batangas",
            },
            {
              id: "hours",
              label: "Hours",
              value: "Mon – Fri: 9:00 AM – 6:00 PM",
            },
            {
              id: "phone",
              label: "Phone",
              value: "+63 9123456789",
              href: "tel:+639123456789",
            },
          ],
        },
      ],
      legal_links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms & Conditions", href: "#" },
      ],
      copyright_text: "© 2026 Leidi Bud Dentals. All Rights Reserved.",
      is_active: true,
    };

    const { data: newFooter, error: createError } = await supabase
      .from(TABLE)
      .insert([defaultFooter])
      .select()
      .single();

    if (createError) throw createError;
    return newFooter;
  }

  return footer;
}

/**
 * Update the Footer record.
 */
export async function updateFooter(payload) {
  const { id, ...updates } = payload;

  if (!id) {
    throw new Error("Missing Footer ID. Cannot update.");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload a footer logo image.
 */
export async function uploadFooterLogo(file) {
  return uploadCmsImage(file);
}
