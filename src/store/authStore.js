import { create } from "zustand";
import { supabase } from "../services/supabase/supabase";

/**
 * Global auth state via Zustand.
 * Bootstrapped once in AuthProvider; consumed by ProtectedRoute and any component.
 */
export const useAuthStore = create((set) => ({
  user: null, // Supabase auth user object
  profile: null, // Row from public.users table
  loading: true, // true until first session check resolves

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  /** Fetch the public.users row for a given auth_id */
  fetchProfile: async (authId) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", authId)
      .single();
    set({ profile: data ?? null });
  },

  clear: () => set({ user: null, profile: null, loading: false }),
}));
