// src/services/settings.js
import { supabase } from "./supabase/supabase";

const SETTINGS_TABLE = "clinic_settings";
const LOGO_BUCKET = "logos";
const MAX_LOGO_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Fetch clinic settings (single row)
 * @returns {Promise<Object>} Clinic settings object
 */
export async function fetchSettings() {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching clinic settings:", error);
    throw new Error(error.message || "Failed to fetch clinic settings");
  }

  if (!data) {
    // Return default settings if none exist
    return {
      clinic_name: "LeidiBud Dentals",
      website: "www.leidibuddentals.com",
      logo_url: null,
      email: "leidibuddentals@gmail.com",
      phone: "0912 345 6789",
      appointment_interval_minutes: 30,
      advance_booking_days: 60,
      cancellation_hours: 24,
      default_appointment_duration: 30,
      reminder_minutes: 60,
      email_notifications_enabled: true,
      sms_notifications_enabled: true,
      marketing_notifications_enabled: false,
    };
  }

  return data;
}

/**
 * Update clinic settings
 * @param {Object} updates - Key-value pairs to update
 * @returns {Promise<Object>} Updated settings
 */
export async function updateSettings(updates) {
  // First, check if settings exist
  const { data: existing, error: fetchError } = await supabase
    .from(SETTINGS_TABLE)
    .select("id")
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking settings existence:", fetchError);
    throw new Error("Failed to update settings");
  }

  let result;

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating settings:", error);
      throw new Error(error.message || "Failed to update settings");
    }
    result = data;
  } else {
    // Insert new
    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .insert({
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting settings:", error);
      throw new Error(error.message || "Failed to create settings");
    }
    result = data;
  }

  return result;
}

/**
 * Upload clinic logo to Supabase Storage
 * @param {File} file - Image file to upload
 * @param {string} oldLogoUrl - Optional URL of old logo to delete
 * @returns {Promise<string>} Public URL of uploaded logo
 */
export async function uploadLogo(file, oldLogoUrl = null) {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(", ")}`
    );
  }

  // Validate file size
  if (file.size > MAX_LOGO_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_LOGO_SIZE / 1024 / 1024}MB limit.`
    );
  }

  // Generate unique file name
  const fileExt = file.name.split(".").pop();
  const fileName = `logo-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  // Delete old logo if provided
  if (oldLogoUrl) {
    try {
      const oldPath = oldLogoUrl.split("/").pop();
      if (oldPath) {
        await supabase.storage.from(LOGO_BUCKET).remove([oldPath]);
      }
    } catch (err) {
      console.warn("Failed to delete old logo:", err);
      // Continue with upload
    }
  }

  // Upload new logo
  const { error: uploadError } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Logo upload error:", uploadError);
    throw new Error("Failed to upload logo. Please try again.");
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(LOGO_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Delete logo from storage by URL
 * @param {string} logoUrl - Public URL of the logo
 */
export async function deleteLogo(logoUrl) {
  if (!logoUrl) return;

  try {
    const filePath = logoUrl.split("/").pop();
    if (filePath) {
      const { error } = await supabase.storage
        .from(LOGO_BUCKET)
        .remove([filePath]);
      if (error) {
        console.warn("Failed to delete logo:", error);
      }
    }
  } catch (err) {
    console.warn("Error deleting logo:", err);
  }
}