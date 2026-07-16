// src/services/cms/cta.js
import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const TABLE = "cms_cta";

/**
 * Fetch the CTA record (creates default if none exists).
 */
export async function fetchCta() {
  const { data: cta, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!cta) {
    // Create default CTA
    const defaultCta = {
      title: "Ready for a Healthier and Brighter Smile?",
      description:
        "Our dental team is here to help you achieve the confident smile you deserve. Book your appointment today and experience quality dental care in a comfortable environment.",
      background_image: "/assets/cta-bg.webp",
      is_active: true,
    };

    const { data: newCta, error: createError } = await supabase
      .from(TABLE)
      .insert([defaultCta])
      .select()
      .single();

    if (createError) throw createError;
    return newCta;
  }

  return cta;
}

/**
 * Update the CTA record.
 */
export async function updateCta(payload) {
  const { id, title, description, background_image, is_active } = payload;

  if (!id) {
    throw new Error("Missing CTA ID. Cannot update.");
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      title,
      description,
      background_image,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upload a CTA background image.
 */
export async function uploadCtaImage(file) {
  return uploadCmsImage(file);
}
