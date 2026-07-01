// src/services/patients.js
import { supabase } from "./supabase/supabase";
/**
 * Find a patient by first_name, last_name, and phone_number.
 * If found, update the record with any new non-null fields.
 * If not found, create a new patient.
 *
 * Returns the patient record.
 */
export async function findOrCreatePatient({
  firstName,
  middleName,
  lastName,
  birthDate,
  gender,
  email,
  phoneNumber,
  address,
}) {
  // Build query to find existing patient
  let query = supabase
    .from("patients")
    .select("*")
    .eq("first_name", firstName)
    .eq("last_name", lastName);

  if (phoneNumber) {
    query = query.eq("phone_number", phoneNumber);
  }

  const { data: existing, error: findErr } = await query.maybeSingle();

  if (findErr) throw findErr;

  if (existing) {
    // --- Update existing patient with new data ---
    const updates = {};
    if (middleName && middleName !== existing.middle_name)
      updates.middle_name = middleName;
    if (birthDate && birthDate !== existing.birth_date)
      updates.birth_date = birthDate;
    if (gender && gender !== existing.gender) updates.gender = gender;
    if (email && email !== existing.email) updates.email = email;
    if (address && address !== existing.address) updates.address = address;
    // If phoneNumber is provided and different, update it (but careful: might be used for matching)
    if (phoneNumber && phoneNumber !== existing.phone_number)
      updates.phone_number = phoneNumber;

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      const { data: updated, error: updateErr } = await supabase
        .from("patients")
        .update(updates)
        .eq("id", existing.id)
        .select()
        .single();

      if (updateErr) throw updateErr;
      return updated;
    }

    return existing; // no changes
  }

  // --- Create new patient ---
  const { data: created, error: createErr } = await supabase
    .from("patients")
    .insert({
      first_name: firstName,
      middle_name: middleName || null,
      last_name: lastName,
      birth_date: birthDate || null,
      gender: gender || null,
      email: email || null,
      phone_number: phoneNumber || null,
      address: address || null,
    })
    .select()
    .single();

  if (createErr) throw createErr;
  return created;
}
