// src/services/cms/gallery.js
import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const GALLERY_TABLE = "cms_gallery";
const IMAGES_TABLE = "cms_gallery_images";
const HIGHLIGHTS_TABLE = "cms_gallery_highlights";

/**
 * Fetch the active gallery record with its images and highlights
 */
export async function fetchActiveGallery() {
  const { data: gallery, error: galleryError } = await supabase
    .from(GALLERY_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (galleryError) throw galleryError;
  if (!gallery) return null;

  const [imagesResult, highlightsResult] = await Promise.all([
    supabase
      .from(IMAGES_TABLE)
      .select("*")
      .eq("gallery_id", gallery.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from(HIGHLIGHTS_TABLE)
      .select("*")
      .eq("gallery_id", gallery.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  if (imagesResult.error) throw imagesResult.error;
  if (highlightsResult.error) throw highlightsResult.error;

  return {
    ...gallery,
    images: imagesResult.data || [],
    highlights: highlightsResult.data || [],
  };
}

/**
 * Fetch the gallery record for admin (creates default if none exists)
 */
export async function fetchGalleryForAdmin() {
  const { data: gallery, error: galleryError } = await supabase
    .from(GALLERY_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (galleryError) throw galleryError;
  if (!gallery) {
    const defaultGallery = {
      pre_title: "Our Gallery",
      title: "Leidi Bud Dentals ",
      highlight_text: "Gallery",
      description:
        "Step inside our dental clinic and explore the spaces, technology, and people dedicated to creating healthier and more confident smiles.",
      is_active: true,
    };
    const { data: newGallery, error: createError } = await supabase
      .from(GALLERY_TABLE)
      .insert([defaultGallery])
      .select()
      .single();
    if (createError) throw createError;
    return { ...newGallery, images: [], highlights: [] };
  }

  const [imagesResult, highlightsResult] = await Promise.all([
    supabase
      .from(IMAGES_TABLE)
      .select("*")
      .eq("gallery_id", gallery.id)
      .order("display_order", { ascending: true }),
    supabase
      .from(HIGHLIGHTS_TABLE)
      .select("*")
      .eq("gallery_id", gallery.id)
      .order("display_order", { ascending: true }),
  ]);

  if (imagesResult.error) throw imagesResult.error;
  if (highlightsResult.error) throw highlightsResult.error;

  return {
    ...gallery,
    images: imagesResult.data || [],
    highlights: highlightsResult.data || [],
  };
}

/**
 * Update gallery, images, and highlights
 */
export async function updateGallery(payload) {
  const { images, highlights, ...galleryData } = payload;

  const { error: galleryUpdateError } = await supabase
    .from(GALLERY_TABLE)
    .update({ ...galleryData, updated_at: new Date().toISOString() })
    .eq("id", galleryData.id);
  if (galleryUpdateError) throw galleryUpdateError;

  const { error: deleteImagesError } = await supabase
    .from(IMAGES_TABLE)
    .delete()
    .eq("gallery_id", galleryData.id);
  if (deleteImagesError) throw deleteImagesError;

  const { error: deleteHighlightsError } = await supabase
    .from(HIGHLIGHTS_TABLE)
    .delete()
    .eq("gallery_id", galleryData.id);
  if (deleteHighlightsError) throw deleteHighlightsError;

  if (images && images.length > 0) {
    const imagesWithOrder = images.map((img, index) => ({
      ...img,
      gallery_id: galleryData.id,
      display_order: index,
      updated_at: new Date().toISOString(),
    }));
    const { error: insertImagesError } = await supabase
      .from(IMAGES_TABLE)
      .insert(imagesWithOrder);
    if (insertImagesError) throw insertImagesError;
  }

  if (highlights && highlights.length > 0) {
    const highlightsWithOrder = highlights.map((h, index) => ({
      ...h,
      gallery_id: galleryData.id,
      display_order: index,
      updated_at: new Date().toISOString(),
    }));
    const { error: insertHighlightsError } = await supabase
      .from(HIGHLIGHTS_TABLE)
      .insert(highlightsWithOrder);
    if (insertHighlightsError) throw insertHighlightsError;
  }

  return fetchGalleryForAdmin();
}

export { uploadCmsImage as uploadGalleryImage };
