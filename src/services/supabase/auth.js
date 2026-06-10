// src/services/supabase/auth.js
import { supabase } from "./supabase";

export async function signUp(email, password, fullName) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authData.user) throw authError;

  const { error } = await supabase.from("users").insert({
    auth_id: authData.user.id,
    email,
    full_name: fullName,
    role: "staff",
    status: "active",
  });
  if (error) throw error;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
