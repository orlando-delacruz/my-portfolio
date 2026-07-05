// src/store/authStore.js
import { create } from "zustand";
import { supabase } from "../services/supabase/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true, // initially true until session is checked

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  fetchProfile: async (authUserId) => {
    if (!authUserId) {
      set({ profile: null });
      return;
    }
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();
    if (error) {
      console.error("Error fetching admin profile:", error);
      set({ profile: null });
    } else {
      set({ profile: data });
    }
  },

  clear: () => set({ user: null, profile: null, loading: false }),
}));
