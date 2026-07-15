// src/services/cms/whyChooseUs.js
import { supabase } from "../supabase/supabase";

const TABLE = "cms_why_choose_us";
const CARDS_TABLE = "cms_why_choose_us_cards";

/**
 * Fetch the active why choose us record with its cards
 */
export async function fetchActiveWhyChooseUs() {
  const { data: section, error: sectionError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sectionError) throw sectionError;
  if (!section) return null;

  const { data: cards, error: cardsError } = await supabase
    .from(CARDS_TABLE)
    .select("*")
    .eq("why_choose_us_id", section.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (cardsError) throw cardsError;

  return { ...section, cards: cards || [] };
}

/**
 * Fetch the section for admin (creates default if none exists)
 */
export async function fetchWhyChooseUsForAdmin() {
  const { data: section, error: sectionError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sectionError) throw sectionError;
  if (!section) {
    const defaultSection = {
      pre_title: "Why Us?",
      title: "Why Patients Choose ",
      highlight_text: "Leidi Bud",
      is_active: true,
    };
    const { data: newSection, error: createError } = await supabase
      .from(TABLE)
      .insert([defaultSection])
      .select()
      .single();
    if (createError) throw createError;
    return { ...newSection, cards: [] };
  }

  const { data: cards, error: cardsError } = await supabase
    .from(CARDS_TABLE)
    .select("*")
    .eq("why_choose_us_id", section.id)
    .order("display_order", { ascending: true });

  if (cardsError) throw cardsError;

  return { ...section, cards: cards || [] };
}

/**
 * Update section and cards
 */
export async function updateWhyChooseUs(payload) {
  const { cards, ...sectionData } = payload;

  const { error: sectionUpdateError } = await supabase
    .from(TABLE)
    .update({ ...sectionData, updated_at: new Date().toISOString() })
    .eq("id", sectionData.id);
  if (sectionUpdateError) throw sectionUpdateError;

  // Delete existing cards
  const { error: deleteError } = await supabase
    .from(CARDS_TABLE)
    .delete()
    .eq("why_choose_us_id", sectionData.id);
  if (deleteError) throw deleteError;

  if (cards && cards.length > 0) {
    const cardsWithOrder = cards.map((card, index) => ({
      ...card,
      why_choose_us_id: sectionData.id,
      display_order: index,
      updated_at: new Date().toISOString(),
    }));
    const { error: insertError } = await supabase
      .from(CARDS_TABLE)
      .insert(cardsWithOrder);
    if (insertError) throw insertError;
  }

  return fetchWhyChooseUsForAdmin();
}
