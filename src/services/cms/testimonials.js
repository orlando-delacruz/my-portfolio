// src/services/cms/testimonials.js
import { supabase } from "../supabase/supabase";

const SECTION_TABLE = "cms_testimonials";
const ITEMS_TABLE = "cms_testimonial_items";

/**
 * Fetch active testimonials section with active items.
 */
export async function fetchActiveTestimonials() {
  const { data: section, error: sectionError } = await supabase
    .from(SECTION_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sectionError) throw sectionError;
  if (!section) return null;

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("testimonial_section_id", section.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

/**
 * Fetch testimonials section for admin (creates default if none exists).
 */
export async function fetchTestimonialsForAdmin() {
  const { data: section, error: sectionError } = await supabase
    .from(SECTION_TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (sectionError) throw sectionError;

  let sectionId;

  if (!section) {
    const defaultSection = {
      pre_title: "Testimonials",
      title: "What Our ",
      highlight_text: "Patients Say",
      is_active: true,
    };
    const { data: newSection, error: createError } = await supabase
      .from(SECTION_TABLE)
      .insert([defaultSection])
      .select()
      .single();

    if (createError) throw createError;
    sectionId = newSection.id;
    const { data: items, error: itemsError } = await supabase
      .from(ITEMS_TABLE)
      .select("*")
      .eq("testimonial_section_id", sectionId)
      .order("display_order", { ascending: true });

    if (itemsError) throw itemsError;
    return { ...newSection, items: items || [] };
  }

  sectionId = section.id;

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("testimonial_section_id", sectionId)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

/**
 * Update testimonials section and items using a proper sync algorithm.
 *
 * Sync strategy:
 * 1. Update section metadata.
 * 2. Fetch existing item IDs from the database.
 * 3. Determine which items to delete, update, and insert.
 * 4. Perform delete, update, and insert operations separately.
 *
 * This ensures existing data is never lost if one operation fails.
 */
export async function updateTestimonials(payload) {
  const { id, pre_title, title, highlight_text, is_active, items } = payload;

  if (!id) {
    throw new Error("Missing section ID. Cannot update testimonials.");
  }

  // ── 1. Update section metadata ──
  const { error: sectionUpdateError } = await supabase
    .from(SECTION_TABLE)
    .update({
      pre_title,
      title,
      highlight_text,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (sectionUpdateError) throw sectionUpdateError;

  // ── 2. Fetch existing item IDs ──
  const { data: existingItems, error: fetchError } = await supabase
    .from(ITEMS_TABLE)
    .select("id")
    .eq("testimonial_section_id", id);

  if (fetchError) throw fetchError;

  const existingIds = new Set(existingItems.map((item) => item.id));

  // ── 3. Separate items into update, insert, and delete ──
  const currentIds = new Set();
  const toUpdate = [];
  const toInsert = [];

  for (const item of items) {
    // Check if this item has a valid database ID (not a temp ID)
    const hasValidId =
      item.id && typeof item.id === "string" && !item.id.startsWith("temp-");

    if (hasValidId) {
      currentIds.add(item.id);
      toUpdate.push(item);
    } else {
      // New item – remove any id property to let the database generate it
      const rest = { ...item };
      delete rest.id;
      toInsert.push(rest);
    }
  }

  // Determine which IDs to delete (present in DB but not in the current payload)
  const idsToDelete = [...existingIds].filter((id) => !currentIds.has(id));

  // ── 4. Delete removed items ──
  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from(ITEMS_TABLE)
      .delete()
      .in("id", idsToDelete);

    if (deleteError) throw deleteError;
  }

  // ── 5. Update existing items ──
  for (const item of toUpdate) {
    const { id: itemId, ...rest } = item;

    const { error: updateError } = await supabase
      .from(ITEMS_TABLE)
      .update({
        ...rest,
        display_order:
          rest.display_order !== undefined ? rest.display_order : 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId);

    if (updateError) throw updateError;
  }

  // ── 6. Insert new items ──
  if (toInsert.length > 0) {
    const itemsToInsert = toInsert.map((item, index) => ({
      ...item,
      testimonial_section_id: id,
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

  // ── 7. Return the updated section ──
  return fetchTestimonialsForAdmin();
}
