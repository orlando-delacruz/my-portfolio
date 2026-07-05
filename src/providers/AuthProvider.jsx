// src/providers/AuthProvider.jsx
import { useEffect } from 'react';
import { supabase } from '../services/supabase/supabase';
import { useAuthStore } from '../store/authStore';

export default function AuthProvider({ children }) {
  const { setUser, setLoading, fetchProfile, clear } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    // 1. Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        // Fetch admin profile from admins table using auth_user_id
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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