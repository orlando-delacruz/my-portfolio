// src/constants/calendarConstants.js

export const CALENDAR_BRANCHES = [
  { id: "rosario", name: "Rosario Branch", initial: "R", color: "#B388FF" },
  { id: "sanjuan", name: "San Juan Branch", initial: "S", color: "#E963C8" },
];

export const BRANCH_MAP = Object.fromEntries(
  CALENDAR_BRANCHES.map((b) => [b.id, b]),
);

export const WEEKDAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/** Max events rendered per day cell before collapsing into "+N more" */
export const MAX_VISIBLE_EVENTS_PER_DAY = 2;

/**
 * Appointment statuses — values must match mock data + eventual Supabase enum.
 * Each token carries both the display color AND the translucent background so
 * CalendarEventCard and the table badges can both derive what they need.
 */
export const APPOINTMENT_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "#F2B90F",
    bg: "rgba(242,185,15,0.20)",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "#1976D2",
    bg: "rgba(25,118,210,0.20)",
  },
  {
    value: "completed",
    label: "Completed",
    color: "#11D896",
    bg: "rgba(17,216,150,0.20)",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "#F81313",
    bg: "rgba(248,19,19,0.20)",
  },
];

/** Quick lookup: status value → full status object */
export const STATUS_MAP = Object.fromEntries(
  APPOINTMENT_STATUSES.map((s) => [s.value, s]),
);
