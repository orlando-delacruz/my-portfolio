// src/store/authStore.js
import { create } from "zustand";
import { supabase } from "../services/supabase/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  fetchProfile: async (authUserId) => {
    const { data } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();
    set({ profile: data ?? null });
  },

  clear: () => set({ user: null, profile: null, loading: false }),
}));
