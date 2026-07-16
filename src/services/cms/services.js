// src/services/cms/services.js
import { supabase } from "../supabase/supabase";

const TABLE = "cms_services";
const BRIDGE_TABLE = "cms_service_branches";
const STORAGE_BUCKET = "cms";
const SERVICES_SECTION_TABLE = "cms_services_section";
const SERVICES_SECTION_ID = "44444444-4444-4444-4444-444444444444";

/**
 * Fetch all CMS services (admin view) with branch details
 */
export async function fetchCmsServices() {
  const { data: services, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;

  const serviceIds = services.map((s) => s.id);
  let branchMap = {};
  if (serviceIds.length > 0) {
    const { data: bridge, error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .select("cms_service_id, branch:branch_id(id, name)")
      .in("cms_service_id", serviceIds);
    if (!bridgeError) {
      bridge.forEach((item) => {
        if (!branchMap[item.cms_service_id])
          branchMap[item.cms_service_id] = [];
        branchMap[item.cms_service_id].push(item.branch);
      });
    }
  }

  return services.map((s) => ({
    ...s,
    branches: branchMap[s.id] || [],
    branch_ids: (branchMap[s.id] || []).map((b) => b.id),
  }));
}

/**
 * Fetch active services for the public homepage (with branch details)
 */
export async function fetchActiveCmsServicesForHomepage() {
  const { data: services, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .eq("show_on_homepage", true)
    .order("display_order", { ascending: true });
  if (error) throw error;

  const serviceIds = services.map((s) => s.id);
  let branchMap = {};
  if (serviceIds.length > 0) {
    const { data: bridge, error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .select("cms_service_id, branch:branch_id(id, name)")
      .in("cms_service_id", serviceIds);
    if (!bridgeError) {
      bridge.forEach((item) => {
        if (!branchMap[item.cms_service_id])
          branchMap[item.cms_service_id] = [];
        branchMap[item.cms_service_id].push(item.branch);
      });
    }
  }

  return services.map((s) => ({
    ...s,
    branches: branchMap[s.id] || [],
    branch_ids: (branchMap[s.id] || []).map((b) => b.id),
  }));
}

/**
 * Create a new CMS service with branch associations
 */
export async function createCmsService(payload) {
  const { branch_ids, ...serviceData } = payload;

  const { data: createdService, error: serviceError } = await supabase
    .from(TABLE)
    .insert([serviceData])
    .select()
    .single();
  if (serviceError) throw serviceError;

  if (branch_ids && branch_ids.length > 0) {
    const bridgeData = branch_ids.map((branch_id) => ({
      cms_service_id: createdService.id,
      branch_id,
    }));
    const { error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .insert(bridgeData);
    if (bridgeError) {
      await supabase.from(TABLE).delete().eq("id", createdService.id);
      throw bridgeError;
    }
  }

  const allServices = await fetchCmsServices();
  return allServices.find((s) => s.id === createdService.id);
}

/**
 * Update an existing CMS service with branch associations
 */
export async function updateCmsService(id, payload) {
  const { branch_ids, ...serviceData } = payload;

  const { error: serviceError } = await supabase
    .from(TABLE)
    .update(serviceData)
    .eq("id", id);
  if (serviceError) throw serviceError;

  const { error: deleteError } = await supabase
    .from(BRIDGE_TABLE)
    .delete()
    .eq("cms_service_id", id);
  if (deleteError) throw deleteError;

  if (branch_ids && branch_ids.length > 0) {
    const bridgeData = branch_ids.map((branch_id) => ({
      cms_service_id: id,
      branch_id,
    }));
    const { error: bridgeError } = await supabase
      .from(BRIDGE_TABLE)
      .insert(bridgeData);
    if (bridgeError) throw bridgeError;
  }

  const allServices = await fetchCmsServices();
  return allServices.find((s) => s.id === id);
}

/**
 * Delete a CMS service (cascade will remove bridge rows)
 */
export async function deleteCmsService(id) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/**
 * Upload an image to Supabase Storage for CMS use.
 *
 * Assumes the bucket already exists (created via SQL migration or Supabase Dashboard).
 * Never attempts to create a bucket at runtime.
 */
export async function uploadCmsImage(file) {
  if (!file) throw new Error("No file provided");
  if (!(file instanceof File)) {
    throw new Error("Invalid file object. Expected a File instance.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`; // Store at root of the bucket

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    // If the bucket is missing, the error will be caught and a clear message shown.
    if (
      uploadError.message?.includes("Bucket not found") ||
      uploadError.message?.includes("does not exist")
    ) {
      throw new Error(
        `Storage bucket "${STORAGE_BUCKET}" was not found. Please create the bucket in Supabase before uploading images.`,
      );
    }
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Fetch the Services section singleton (creates default if missing).
 */
export async function fetchServicesSection() {
  const { data: section, error: sectionError } = await supabase
    .from(SERVICES_SECTION_TABLE)
    .select("*")
    .eq("id", SERVICES_SECTION_ID)
    .maybeSingle();

  if (sectionError) throw sectionError;

  if (!section) {
    const defaultSection = {
      id: SERVICES_SECTION_ID,
      pre_title: "Services",
      title: "Dental Services ",
      highlight_text: "We Offer",
      is_active: true,
    };
    const { data: newSection, error: createError } = await supabase
      .from(SERVICES_SECTION_TABLE)
      .insert([defaultSection])
      .select()
      .single();

    if (createError) throw createError;
    return newSection;
  }

  return section;
}

/**
 * Update the Services section singleton.
 */
export async function updateServicesSection(payload) {
  const { id, pre_title, title, highlight_text, is_active } = payload;

  if (!id) {
    throw new Error("Missing section ID.");
  }

  const { data, error } = await supabase
    .from(SERVICES_SECTION_TABLE)
    .update({
      pre_title,
      title,
      highlight_text,
      is_active: is_active !== undefined ? is_active : true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
