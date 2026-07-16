// ================================================================
// FILE: src/services/cms/faqs.js
// ================================================================

import { supabase } from "../supabase/supabase";
import { uploadCmsImage } from "./services";

const SECTION_TABLE = "cms_faqs";
const ITEMS_TABLE = "cms_faq_items";

// Fixed singleton ID for the FAQ section
const FAQ_SECTION_ID = "11111111-1111-1111-1111-111111111111";

export async function fetchActiveFaqs() {
  const { data: section, error: sectionError } = await supabase
    .from(SECTION_TABLE)
    .select("*")
    .eq("id", FAQ_SECTION_ID)
    .eq("is_active", true)
    .maybeSingle();

  if (sectionError) throw sectionError;
  if (!section) return null;

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("faq_section_id", section.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

export async function fetchFaqsForAdmin() {
  const { data: section, error: sectionError } = await supabase
    .from(SECTION_TABLE)
    .select("*")
    .eq("id", FAQ_SECTION_ID)
    .maybeSingle();

  if (sectionError) throw sectionError;

  if (!section) {
    const defaultSection = {
      id: FAQ_SECTION_ID,
      pre_title: "FAQ",
      title: "Frequently Asked ",
      highlight_text: "Questions",
      form_image: "https://picsum.photos/seed/dental-clinic/638/271",
      is_active: true,
    };
    const { data: newSection, error: createError } = await supabase
      .from(SECTION_TABLE)
      .insert([defaultSection])
      .select()
      .single();

    if (createError) throw createError;
    return { ...newSection, items: [] };
  }

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("faq_section_id", section.id)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

export async function updateFaqs(payload) {
  const { id, pre_title, title, highlight_text, form_image, is_active, items } =
    payload;
  const sectionId = id || FAQ_SECTION_ID;

  const { error: sectionUpdateError } = await supabase
    .from(SECTION_TABLE)
    .update({
      pre_title,
      title,
      highlight_text,
      form_image: form_image || null,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sectionId);

  if (sectionUpdateError) throw sectionUpdateError;

  const { data: existingItems, error: fetchError } = await supabase
    .from(ITEMS_TABLE)
    .select("id")
    .eq("faq_section_id", sectionId);

  if (fetchError) throw fetchError;

  const existingIds = new Set(existingItems.map((item) => item.id));
  const currentIds = new Set();
  const toUpdate = [];
  const toInsert = [];

  for (const item of items) {
    const hasValidId =
      item.id && typeof item.id === "string" && !item.id.startsWith("temp-");
    if (hasValidId) {
      currentIds.add(item.id);
      toUpdate.push(item);
    } else {
      const rest = { ...item };
      delete rest.id;
      toInsert.push(rest);
    }
  }

  const idsToDelete = [...existingIds].filter((id) => !currentIds.has(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from(ITEMS_TABLE)
      .delete()
      .in("id", idsToDelete);
    if (deleteError) throw deleteError;
  }

  for (const item of toUpdate) {
    const { id: itemId, ...rest } = item;
    const { error: updateError } = await supabase
      .from(ITEMS_TABLE)
      .update({
        question: rest.question,
        answer: rest.answer,
        display_order:
          rest.display_order !== undefined ? rest.display_order : 0,
        is_active: rest.is_active !== undefined ? rest.is_active : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);
    if (updateError) throw updateError;
  }

  if (toInsert.length > 0) {
    const itemsToInsert = toInsert.map((item, index) => ({
      ...item,
      faq_section_id: sectionId,
      display_order:
        item.display_order !== undefined ? item.display_order : index,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));
    const { error: insertError } = await supabase
      .from(ITEMS_TABLE)
      .insert(itemsToInsert);
    if (insertError) throw insertError;
  }

  return fetchFaqsForAdmin();
}

export async function uploadFaqFormImage(file) {
  return uploadCmsImage(file);
}
