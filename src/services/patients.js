// src/services/patients.js
import { supabase } from "./supabase/supabase";

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const first_name = parts.shift();
  const last_name = parts.length ? parts.join(" ") : first_name;
  return { first_name, last_name };
}

export async function findOrCreatePatient({ patientName, contactNumber }) {
  const { first_name, last_name } = splitName(patientName);

  const { data: existing, error: findErr } = await supabase
    .from("patients")
    .select("*")
    .eq("first_name", first_name)
    .eq("last_name", last_name)
    .eq("phone_number", contactNumber)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing;

  const { data: created, error: createErr } = await supabase
    .from("patients")
    .insert({ first_name, last_name, phone_number: contactNumber })
    .select()
    .single();

  if (createErr) throw createErr;
  return created;
}
