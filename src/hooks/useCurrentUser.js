// src/hooks/useCurrentUser.js
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/supabase";

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser(authUserId) {
    const { data } = await supabase
      .from("admins") // users → admins
      .select("*")
      .eq("auth_user_id", authUserId) // auth_id → auth_user_id
      .single();
    setUser(data);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchUser(session.user.id);
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) fetchUser(session.user.id);
        else {
          setUser(null);
          setLoading(false);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
