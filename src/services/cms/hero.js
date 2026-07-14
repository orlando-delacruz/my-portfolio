// src/services/cms/hero.js
import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const HERO_TABLE = "cms_hero";
const CARDS_TABLE = "cms_hero_cards";

/**
 * Fetch the active hero record with its cards
 */
export async function fetchActiveHero() {
  const { data: hero, error: heroError } = await supabase
    .from(HERO_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (heroError) throw heroError;
  if (!hero) return null;

  const { data: cards, error: cardsError } = await supabase
    .from(CARDS_TABLE)
    .select("*")
    .eq("hero_id", hero.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (cardsError) throw cardsError;

  return { ...hero, cards: cards || [] };
}

/**
 * Fetch the hero record for admin (creates default if none exists)
 */
export async function fetchHeroForAdmin() {
  const { data: hero, error: heroError } = await supabase
    .from(HERO_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (heroError) throw heroError;
  if (!hero) {
    const defaultHero = {
      bio_badge: "Trusted Dental Care",
      heading: "Healthy Smiles",
      highlight_text: "Start Here",
      subheading:
        "We provide professional, gentle, and modern dental care for patients of all ages.",
      primary_button_text: "Book an Appointment",
      primary_button_link: "/book",
      hero_image: null,
      is_active: true,
    };
    const { data: newHero, error: createError } = await supabase
      .from(HERO_TABLE)
      .insert([defaultHero])
      .select()
      .single();
    if (createError) throw createError;
    return { ...newHero, cards: [] };
  }

  const { data: cards, error: cardsError } = await supabase
    .from(CARDS_TABLE)
    .select("*")
    .eq("hero_id", hero.id)
    .order("display_order", { ascending: true });

  if (cardsError) throw cardsError;

  return { ...hero, cards: cards || [] };
}

/**
 * Update hero and cards
 */
export async function updateHero(payload) {
  const { cards, ...heroData } = payload;

  const { error: heroUpdateError } = await supabase
    .from(HERO_TABLE)
    .update({ ...heroData, updated_at: new Date().toISOString() })
    .eq("id", heroData.id);

  if (heroUpdateError) throw heroUpdateError;

  const { error: deleteError } = await supabase
    .from(CARDS_TABLE)
    .delete()
    .eq("hero_id", heroData.id);

  if (deleteError) throw deleteError;

  if (cards && cards.length > 0) {
    const cardsWithHeroId = cards.map((card) => ({
      ...card,
      hero_id: heroData.id,
      updated_at: new Date().toISOString(),
    }));
    const { error: insertError } = await supabase
      .from(CARDS_TABLE)
      .insert(cardsWithHeroId);
    if (insertError) throw insertError;
  }

  return fetchHeroForAdmin();
}

// Re-export upload helper
export { uploadCmsImage };
