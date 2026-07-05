// src/providers/AuthProvider.jsx
import { useEffect } from "react";
import { supabase } from "../services/supabase/supabase";
import { useAuthStore } from "../store/authStore";

export default function AuthProvider({ children }) {
  const { setUser, setLoading, fetchProfile, clear } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // 1. Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        // console.log('🔄 Session restored:', session.user.email);
        setUser(session.user);
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        // console.log('🔄 No session found');
        setLoading(false);
      }
    });

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      // console.log('🔄 Auth event:', event, session?.user?.email);

      if (session?.user) {
        // Only set user and profile on sign-in or token refresh
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setUser(session.user);
          fetchProfile(session.user.id).finally(() => setLoading(false));
        }
      } else {
        // On sign-out or session expiry, clear the store
        if (event === 'SIGNED_OUT') {
          clear();
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}