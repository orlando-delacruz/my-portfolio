// src/services/storage.js
import { supabase } from "./supabase/supabase";

const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Upload an avatar image to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} userId - The user ID (used as folder name)
 * @returns {Promise<string>} The public URL of the uploaded avatar
 */
export async function uploadAvatar(file, userId) {
  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(", ")}`,
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
    );
  }

  // Generate a unique file path
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Avatar upload error:", uploadError);
    throw new Error("Failed to upload avatar. Please try again.");
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Delete an avatar from storage
 * @param {string} userId - The user ID whose avatar to delete
 */
export async function deleteAvatar(userId) {
  // List all files in the user's folder
  const { data: files, error: listError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);

  if (listError) {
    console.error("Error listing avatars:", listError);
    return;
  }

  if (!files || files.length === 0) return;

  // Delete all files in the user's folder
  const filePaths = files.map((file) => `${userId}/${file.name}`);
  const { error: deleteError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .remove(filePaths);

  if (deleteError) {
    console.error("Error deleting avatar:", deleteError);
  }
}
