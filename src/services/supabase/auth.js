import { supabase } from "./supabase";

export async function signUp(email, password, fullName) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError || !authData.user) throw authError;

  const { error } = await supabase.from("admins").insert({
    auth_user_id: authData.user.id, // auth_id → auth_user_id
    email,
    full_name: fullName,
    role: "admin",
    status: "active",
    login_method: "password",
    username: email.split("@")[0], // temporary username derived from email
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
