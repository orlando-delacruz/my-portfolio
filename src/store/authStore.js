// src/store/authStore.js
import { create } from "zustand";
import { supabase } from "../services/supabase/supabase";

export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  isAuthorized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setAuthorized: (isAuthorized) => set({ isAuthorized }),

  fetchProfile: async (authUserId) => {
    if (!authUserId) {
      set({ profile: null, isAuthorized: false });
      return;
    }
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("auth_user_id", authUserId)
      .single();
    if (error) {
      console.error("Error fetching admin profile:", error);
      set({ profile: null, isAuthorized: false });
    } else {
      set({ profile: data, isAuthorized: true });
    }
  },

  clear: () => set({ user: null, profile: null, loading: false, isAuthorized: false }),
}));