// src/services/cms/about.js
import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const ABOUT_TABLE = "cms_about";
const FEATURES_TABLE = "cms_about_features";

/**
 * Fetch the active about record with its features
 */
export async function fetchActiveAbout() {
  const { data: about, error: aboutError } = await supabase
    .from(ABOUT_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (aboutError) throw aboutError;
  if (!about) return null;

  const { data: features, error: featuresError } = await supabase
    .from(FEATURES_TABLE)
    .select("*")
    .eq("about_id", about.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (featuresError) throw featuresError;

  return { ...about, features: features || [] };
}

/**
 * Fetch the about record for admin (creates default if none exists)
 */
export async function fetchAboutForAdmin() {
  const { data: about, error: aboutError } = await supabase
    .from(ABOUT_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (aboutError) throw aboutError;
  if (!about) {
    const defaultAbout = {
      pre_title: "About Our Clinic",
      title: "Comfortable Dental Care",
      accent_text: "You Can Trust",
      description:
        "At Leidi Bud, we believe every patient deserves quality dental care in a welcoming and stress-free environment. Our team focuses on preventive, restorative, and cosmetic dentistry to help patients achieve healthy and confident smiles.\n\nWe combine compassionate care with modern dental technology to provide safe, effective, and personalized treatments for every patient.",
      image: null,
      is_active: true,
    };
    const { data: newAbout, error: createError } = await supabase
      .from(ABOUT_TABLE)
      .insert([defaultAbout])
      .select()
      .single();
    if (createError) throw createError;
    return { ...newAbout, features: [] };
  }

  const { data: features, error: featuresError } = await supabase
    .from(FEATURES_TABLE)
    .select("*")
    .eq("about_id", about.id)
    .order("display_order", { ascending: true });

  if (featuresError) throw featuresError;

  return { ...about, features: features || [] };
}

/**
 * Update about and features
 */
export async function updateAbout(payload) {
  const { features, ...aboutData } = payload;

  const { error: aboutUpdateError } = await supabase
    .from(ABOUT_TABLE)
    .update({ ...aboutData, updated_at: new Date().toISOString() })
    .eq("id", aboutData.id);

  if (aboutUpdateError) throw aboutUpdateError;

  // Delete existing features
  const { error: deleteError } = await supabase
    .from(FEATURES_TABLE)
    .delete()
    .eq("about_id", aboutData.id);
  if (deleteError) throw deleteError;

  if (features && features.length > 0) {
    const featuresWithAboutId = features.map((f) => ({
      ...f,
      about_id: aboutData.id,
      updated_at: new Date().toISOString(),
    }));
    const { error: insertError } = await supabase
      .from(FEATURES_TABLE)
      .insert(featuresWithAboutId);
    if (insertError) throw insertError;
  }

  return fetchAboutForAdmin();
}

// Re-export upload helper
export { uploadCmsImage as uploadAboutImage };
