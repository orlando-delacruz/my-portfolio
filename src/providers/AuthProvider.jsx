// src/providers/AuthProvider.jsx
import { useEffect } from "react";
import { supabase } from "../services/supabase/supabase";
import { useAuthStore } from "../store/authStore";

/**
 * Mounts once at the app root.
 * Bootstraps the Supabase session and keeps the Zustand auth store in sync.
 * No UI — purely a side-effect container.
 */
export default function AuthProvider({ children }) {
  const { setUser, setLoading, fetchProfile, clear } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // 1. Restore existing session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for future sign-in / sign-out events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        clear();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}