// src/services/patients.js
import { supabase } from "./supabase/supabase";

export async function findOrCreatePatient({
  firstName,
  middleName,
  lastName,
  birthDate,
  gender,
  email,
  phoneNumber,
  address,
  isOrthodontic = false,
  branchId = null,
}) {
  // 1. Try exact match: first + last + phone (if phone provided)
  let query = supabase
    .from("patients")
    .select("*")
    .eq("first_name", firstName)
    .eq("last_name", lastName);

  if (phoneNumber) {
    query = query.eq("phone_number", phoneNumber);
  }

  let { data: existing, error: findErr } = await query.maybeSingle();

  // 2. If not found and phone was provided, try matching only by name
  if (!existing && phoneNumber) {
    const { data: nameMatch, error: nameErr } = await supabase
      .from("patients")
      .select("*")
      .eq("first_name", firstName)
      .eq("last_name", lastName)
      .maybeSingle();

    if (!nameErr && nameMatch) {
      existing = nameMatch;
    }
  }

  if (findErr && !existing) throw findErr;

  if (existing) {
    // Update existing patient with new data
    const updates = {};
    if (middleName && middleName !== existing.middle_name)
      updates.middle_name = middleName;
    if (birthDate && birthDate !== existing.birth_date)
      updates.birth_date = birthDate;
    if (gender && gender !== existing.gender) updates.gender = gender;
    if (email && email !== existing.email) updates.email = email;
    if (address && address !== existing.address) updates.address = address;
    // Only update phone if provided and different
    if (phoneNumber && phoneNumber !== existing.phone_number)
      updates.phone_number = phoneNumber;
    if (
      isOrthodontic !== undefined &&
      isOrthodontic !== existing.is_orthodontic
    ) {
      updates.is_orthodontic = isOrthodontic;
    }
    if (branchId !== undefined && branchId !== existing.branch_id) {
      updates.branch_id = branchId;
    }

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
    return existing;
  }

  // 3. Create new patient
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
      is_orthodontic: isOrthodontic || false,
      branch_id: branchId || null,
    })
    .select()
    .single();

  if (createErr) throw createErr;
  return created;
}

// src/services/patients.js (relevant part)
export async function getOrthodonticPatients() {
  const { data, error } = await supabase
    .from("patients")
    .select("*, branch:branches(id, name)") // ✅ include branch
    .eq("is_orthodontic", true)
    .order("first_name")
    .order("last_name");

  if (error) throw error;
  return data || [];
}

export async function fetchPatients({
  page = 1,
  pageSize = 10,
  search = "",
  orthodonticFilter = "all",
}) {
  let query = supabase
    .from("patients")
    .select("*, branch:branches(id, name)", { count: "exact" });

  if (search) {
    const searchTerm = search.trim();
    query = query.or(
      `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`,
    );
  }

  if (orthodonticFilter === "ortho") {
    query = query.eq("is_orthodontic", true);
  } else if (orthodonticFilter === "regular") {
    query = query.eq("is_orthodontic", false);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to).order("first_name").order("last_name");

  const { data, error, count } = await query;

  if (error) throw error;
  return { data: data || [], count: count || 0 };
}

export async function updatePatient(patientId, updates) {
  const { data, error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", patientId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
