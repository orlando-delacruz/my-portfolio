// src/data/admin/clinicClosures.js
import {
  MdOutlineBuild,
  MdOutlineEventNote,
  MdOutlineMoreHoriz,
  MdOutlineFlightTakeoff,
  MdOutlineSchool,
} from "react-icons/md";

// ── Constants ──
export const CLOSURE_TYPES = {
  equipment_maintenance: {
    value: "equipment_maintenance",
    label: "Equipment Maintenance",
    icon: MdOutlineBuild,
  },
  out_of_clinic: {
    value: "out_of_clinic",
    label: "Out of Clinic Service",
    icon: MdOutlineEventNote,
  },
  others: {
    value: "others",
    label: "Others",
    icon: MdOutlineMoreHoriz,
  },
  vacation: {
    value: "vacation",
    label: "Vacation",
    icon: MdOutlineFlightTakeoff,
  },
  training: {
    value: "training",
    label: "Training",
    icon: MdOutlineSchool,
  },
};

export const CLOSURE_STATUSES = {
  active: {
    value: "active",
    label: "Active",
    color: "#11D896",
    bg: "rgba(17,216,150,0.20)",
  },
  scheduled: {
    value: "scheduled",
    label: "Scheduled",
    color: "#F2B90F",
    bg: "rgba(242,185,15,0.20)",
  },
  past: {
    value: "past",
    label: "Past",
    color: "#1976D2",
    bg: "rgba(25,118,210,0.20)",
  },
  cancelled: {
    value: "cancelled",
    label: "Cancelled",
    color: "#F81313",
    bg: "rgba(248,19,19,0.20)",
  },
};

export const CLOSURE_TYPE_OPTIONS = [
  { value: "all", label: "All Closure Types" },
  { value: "equipment_maintenance", label: "Equipment Maintenance" },
  { value: "out_of_clinic", label: "Out of Clinic Service" },
  { value: "others", label: "Others" },
  { value: "vacation", label: "Vacation" },
  { value: "training", label: "Training" },
];

export const CLOSURE_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "scheduled", label: "Scheduled" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export const CLOSURE_TYPE_CONFIG = Object.fromEntries(
  Object.entries(CLOSURE_TYPES).map(([key, val]) => [key, val]),
);

export const CLOSURE_STATUS_CONFIG = Object.fromEntries(
  Object.entries(CLOSURE_STATUSES).map(([key, val]) => [key, val]),
);

export const TABLE_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "time", label: "Time", center: true },
  { key: "closureType", label: "Closure Type" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status", center: true },
  { key: "actions", label: "Actions", center: true },
];

// ── Mock Data ──
export const mockClosures = [
  {
    id: "1",
    date: "2026-06-29",
    dayOfWeek: "Monday",
    startTime: "06:00:00",
    endTime: "16:00:00",
    timeRange: "6:00 AM - 4:00 PM",
    closureType: "equipment_maintenance",
    reason: "Dental Chair Repair",
    status: "active",
    branchId: "rosario",
  },
  {
    id: "2",
    date: "2026-06-25",
    dayOfWeek: "Thursday",
    startTime: "06:00:00",
    endTime: "16:00:00",
    timeRange: "6:00 AM - 4:00 PM",
    closureType: "out_of_clinic",
    reason: "Dental Mission",
    status: "scheduled",
    branchId: "sanjuan",
  },
  {
    id: "3",
    date: "2026-06-08",
    dayOfWeek: "Thursday",
    startTime: "06:00:00",
    endTime: "12:00:00",
    timeRange: "6:00 AM - 12:00 PM",
    closureType: "others",
    reason: "Birthday Celebration",
    status: "scheduled",
    branchId: "rosario",
  },
  {
    id: "4",
    date: "2026-05-31",
    dayOfWeek: "Sunday",
    startTime: "06:00:00",
    endTime: "12:00:00",
    timeRange: "6:00 AM - 12:00 PM",
    closureType: "vacation",
    reason: "Hiking",
    status: "past",
    branchId: "sanjuan",
  },
  {
    id: "5",
    date: "2026-05-24",
    dayOfWeek: "Sunday",
    startTime: "12:00:00",
    endTime: "16:00:00",
    timeRange: "12:00 PM - 4:00 PM",
    closureType: "training",
    reason: "Seminar",
    status: "past",
    branchId: "rosario",
  },
  {
    id: "6",
    date: "2026-05-16",
    dayOfWeek: "Saturday",
    startTime: "06:00:00",
    endTime: "12:00:00",
    timeRange: "6:00 AM - 12:00 PM",
    closureType: "vacation",
    reason: "Hiking",
    status: "cancelled",
    branchId: "sanjuan",
  },
];
