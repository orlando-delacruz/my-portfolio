import { useEffect } from "react";
import { supabase } from "../services/supabase/supabase";

export function useRealtimeAppointments(onchange) {
  useEffect(() => {
    const channel = supabase
      .channel("appointments-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        (payload) => onchange(payload),
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [onchange]);
}
