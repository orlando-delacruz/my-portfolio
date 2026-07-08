// src/data/admin/settings.js
import { MdOutlineAccessTime, MdOutlineInfo, MdOutlinePerson, MdOutlineStorefront, MdOutlineEventNote, MdOutlineNotifications } from "react-icons/md";

// ── Icons for each section ──
export const SETTINGS_SECTION_ICONS = {
  operatingHours: MdOutlineAccessTime,
  clinicInfo: MdOutlineInfo,
  profile: MdOutlinePerson,
  branches: MdOutlineStorefront,
  appointment: MdOutlineEventNote,
  notification: MdOutlineNotifications,
};

// ── Mock Operating Hours ──
export const MOCK_OPERATING_HOURS = {
  "rosario": [
    { day: 0, label: "Sunday", open: null, close: null, isClosed: true },
    { day: 1, label: "Monday", open: "09:00", close: "18:00", isClosed: false },
    { day: 2, label: "Tuesday", open: "09:00", close: "18:00", isClosed: false },
    { day: 3, label: "Wednesday", open: null, close: null, isClosed: true },
    { day: 4, label: "Thursday", open: "09:00", close: "17:00", isClosed: false },
    { day: 5, label: "Friday", open: "09:00", close: "14:00", isClosed: false },
    { day: 6, label: "Saturday", open: null, close: null, isClosed: true },
  ],
  "sanjuan": [
    { day: 0, label: "Sunday", open: null, close: null, isClosed: true },
    { day: 1, label: "Monday", open: "10:00", close: "19:00", isClosed: false },
    { day: 2, label: "Tuesday", open: "10:00", close: "19:00", isClosed: false },
    { day: 3, label: "Wednesday", open: "10:00", close: "19:00", isClosed: false },
    { day: 4, label: "Thursday", open: "10:00", close: "19:00", isClosed: false },
    { day: 5, label: "Friday", open: "10:00", close: "18:00", isClosed: false },
    { day: 6, label: "Saturday", open: null, close: null, isClosed: true },
  ],
};

// ── Mock Clinic Information ──
export const MOCK_CLINIC_INFO = {
  name: "LeidiBud Dentals",
  email: "leidibuddentals@gmail.com",
  phone: "0912 345 6789",
  website: "www.leidibuddentals.com",
  logoUrl: null,
};

// ── Mock Profile ──
export const MOCK_PROFILE = {
  fullName: "Yenyen Galabit",
  email: "yenyen@leidibuddentals.com",
  phone: "0912 345 6789",
  avatarUrl: null,
  role: "admin",
};

// ── Mock Google Login Status ──
export const MOCK_GOOGLE_LOGIN = {
  connected: true,
  email: "yenyen@gmail.com",
};

// ── Mock Branches ──
export const MOCK_BRANCHES = [
  {
    id: "san-antonio",
    name: "San Antonio Branch",
    address: "Brgy. Sampaga San Antonio Quezon",
  },
  {
    id: "san-juan",
    name: "San Juan Branch",
    address: "Brgy. Sampaga San Antonio Quezon",
  },
];

// ── Mock Appointment Settings ──
export const MOCK_APPOINTMENT_SETTINGS = {
  intervalMinutes: 30,
  advanceBookingDays: 60,
  cancellationHours: 24,
  defaultDurationMinutes: 30,
};

// ── Mock Notification Preferences ──
export const MOCK_NOTIFICATIONS = {
  email: true,
  sms: true,
  reminders: true,
  marketing: false,
};

// ── Time options (for select fields) ──
export const TIME_OPTIONS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00",
];

// ── Select options for appointment settings ──
export const INTERVAL_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
];

export const ADVANCE_BOOKING_OPTIONS = [
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
];

export const CANCELLATION_OPTIONS = [
  { value: 2, label: "2 hours" },
  { value: 4, label: "4 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];

export const DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "60 minutes" },
  { value: 90, label: "90 minutes" },
  { value: 120, label: "120 minutes" },
];