// src/providers/AuthProvider.jsx
import { useEffect } from "react";
import { supabase } from "../services/supabase/supabase";
import { useAuthStore } from "../store/authStore";

export default function AuthProvider({ children }) {
  const { setUser, setLoading, fetchProfile, clear, setAuthorized } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // 1. Restore session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        // Keep loading true until profile is fetched
        await fetchProfile(session.user.id);
        setLoading(false);
      } else {
        setLoading(false);
        setAuthorized(false);
      }
    });

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        setLoading(false);
      } else {
        clear();
        setAuthorized(false);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [clear, fetchProfile, setAuthorized, setLoading, setUser]);

  return children;
}