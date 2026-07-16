// src/services/cms/branches.js
import { supabase } from "../supabase/supabase";

const SECTION_TABLE = "cms_branches";
const ITEMS_TABLE = "cms_branch_items";

/**
 * Fetch the active branches section with its active items.
 */
export async function fetchActiveBranchesSection() {
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
    .eq("branch_section_id", section.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

/**
 * Fetch the branches section for admin (creates default if none exists).
 */
export async function fetchBranchesSectionForAdmin() {
  // Fetch existing section
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
    // Create default section
    const defaultSection = {
      pre_title: "Our Branches",
      title: "Visit Our ",
      highlight_text: "Clinic Branches",
      description: "Find a Leidi Bud Dentals clinic near you.",
      is_active: true,
    };
    const { data: newSection, error: createError } = await supabase
      .from(SECTION_TABLE)
      .insert([defaultSection])
      .select()
      .single();

    if (createError) throw createError;
    sectionId = newSection.id;
    // Continue with new section
    const { data: items, error: itemsError } = await supabase
      .from(ITEMS_TABLE)
      .select("*")
      .eq("branch_section_id", sectionId)
      .order("display_order", { ascending: true });

    if (itemsError) throw itemsError;
    return { ...newSection, items: items || [] };
  }

  sectionId = section.id;

  const { data: items, error: itemsError } = await supabase
    .from(ITEMS_TABLE)
    .select("*")
    .eq("branch_section_id", sectionId)
    .order("display_order", { ascending: true });

  if (itemsError) throw itemsError;

  return { ...section, items: items || [] };
}

export async function updateBranchesSection(payload) {
  const { id, pre_title, title, highlight_text, is_active, items } = payload;

  if (!id) {
    throw new Error("Missing section ID. Cannot update branches section.");
  }

  console.log("[updateBranchesSection] Updating section:", id);
  console.log("[updateBranchesSection] Items count:", items?.length || 0);

  // Update section metadata
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

  if (sectionUpdateError) {
    console.error(
      "[updateBranchesSection] Section update error:",
      sectionUpdateError,
    );
    throw sectionUpdateError;
  }

  // Delete existing items
  const { error: deleteError } = await supabase
    .from(ITEMS_TABLE)
    .delete()
    .eq("branch_section_id", id);

  if (deleteError) {
    console.error("[updateBranchesSection] Delete error:", deleteError);
    throw deleteError;
  }

  // Insert new items
  if (items && items.length > 0) {
    const itemsWithSectionId = items.map((item, index) => ({
      name: item.name,
      location: item.location,
      map_embed_url: item.map_embed_url,
      address: item.address,
      phone: item.phone,
      email: item.email,
      hours: item.hours,
      services: item.services || "",
      branch_section_id: id,
      display_order:
        item.display_order !== undefined ? item.display_order : index,
      is_active: item.is_active !== undefined ? item.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    console.log(
      "[updateBranchesSection] Inserting",
      itemsWithSectionId.length,
      "items",
    );

    const { error: insertError } = await supabase
      .from(ITEMS_TABLE)
      .insert(itemsWithSectionId);

    if (insertError) {
      console.error("[updateBranchesSection] Insert error:", insertError);
      throw insertError;
    }

    console.log("[updateBranchesSection] Insert successful");
  } else {
    console.log("[updateBranchesSection] No items to insert");
  }

  return fetchBranchesSectionForAdmin();
}

/**
 * Upload an image for a branch item (reuse existing CMS upload).
 */
export async function uploadBranchImage(file) {
  const { uploadCmsImage } = await import("./services");
  return uploadCmsImage(file);
}
