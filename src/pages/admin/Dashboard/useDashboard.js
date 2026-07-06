// src/pages/admin/Dashboard/useDashboard.js
import { useMemo } from "react";

/**
 * Get time-based greeting.
 * @returns {string} "Good Morning", "Good Afternoon", or "Good Evening"
 */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

/**
 * Get display name: first name only, with "Dr." prefix if role is Dentist.
 * @param {Object} profile - Admin profile from authStore.
 * @param {Object} user - Auth user (for email fallback).
 * @returns {string} Display name (e.g., "Dr. Yenyen" or "John").
 */
const getDisplayName = (profile, user) => {
  // 1. Use full_name from profile, extract first name
  if (profile?.full_name) {
    const fullName = profile.full_name;
    const firstName = fullName.split(" ")[0]; // take first word
    const isDentist = profile.role?.toLowerCase() === "dentist";
    if (isDentist && !firstName.toLowerCase().includes("dr.")) {
      return `Dr. ${firstName}`;
    }
    return firstName;
  }
  // 2. Fallback to user email (remove domain)
  if (user?.email) {
    return user.email.split("@")[0];
  }
  // 3. Final fallback
  return "Admin";
};

/**
 * Hook to provide dynamic greeting, formatted date, and day name.
 * @param {Object} profile - Admin profile from authStore.
 * @param {Object} user - Auth user (for fallback).
 * @returns {{ greeting: string, formattedDate: string, dayName: string }}
 */
const useDashboard = (profile, user) => {
  const now = useMemo(() => new Date(), []);

  const displayName = useMemo(() => getDisplayName(profile, user), [profile, user]);

  const greeting = useMemo(() => {
    return `${getGreeting()}, ${displayName}!`;
  }, [displayName]);

  const formattedDate = useMemo(
    () =>
      now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [now]
  );

  const dayName = useMemo(
    () => now.toLocaleDateString("en-US", { weekday: "long" }),
    [now]
  );

  return { greeting, formattedDate, dayName };
};

export default useDashboard;