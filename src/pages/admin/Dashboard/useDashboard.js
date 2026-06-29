// src/pages/admin/Dashboard/useDashboard.js
import { useMemo } from "react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "GOOD MORNING";
  if (hour < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
};

const useDashboard = (userName = "DOCTOR YENYEN") => {
  const now = new Date();

  const greeting = useMemo(() => `${getGreeting()}, ${userName}!`, [userName]);

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const dayName = useMemo(
    () => now.toLocaleDateString("en-US", { weekday: "long" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { greeting, formattedDate, dayName };
};

export default useDashboard;
