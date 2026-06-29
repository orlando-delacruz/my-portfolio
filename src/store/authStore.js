import { create } from "zustand";
import { supabase } from "../services/supabase/supabase";

export const useAuthStore = create((set) => ({
  user: null, // Supabase auth user object
  profile: null, // Row from public.admins table
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  /** Fetch the admins row for a given auth_user_id */
  fetchProfile: async (authUserId) => {
    const { data } = await supabase
      .from("admins") // users → admins
      .select("*")
      .eq("auth_user_id", authUserId) // auth_id → auth_user_id
      .single();
    set({ profile: data ?? null });
  },

  clear: () => set({ user: null, profile: null, loading: false }),
}));
