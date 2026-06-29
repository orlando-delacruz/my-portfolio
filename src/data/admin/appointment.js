// src/data/admin/appointment.js

// ── Appointments array ──────────────────────────────────────────────────────
const appointments = [
  {
    id: "apt-001",
    referenceNo: "REF-20260701-001",
    patientName: "Mea France Lacdao",
    contactNumber: "+63 912 345 6789",
    branch: "san-juan",
    date: "Jul 1, 2026",
    time: "9:00 AM",
    reason: "Dental Checkup",
    status: "completed",
  },
  {
    id: "apt-002",
    referenceNo: "REF-20260701-002",
    patientName: "Rose Ann Lacdao",
    contactNumber: "+63 917 987 6543",
    branch: "rosario",
    date: "Jul 1, 2026",
    time: "9:30 AM",
    reason: "Teeth Cleaning",
    status: "completed",
  },
  {
    id: "apt-003",
    referenceNo: "REF-20260701-003",
    patientName: "Nicole Curita",
    contactNumber: "+63 999 123 4567",
    branch: "san-juan",
    date: "Jul 1, 2026",
    time: "10:30 AM",
    reason: "Tooth Filling",
    status: "confirmed",
  },
  {
    id: "apt-004",
    referenceNo: "REF-20260701-004",
    patientName: "Issay Cueto",
    contactNumber: "+63 926 543 2109",
    branch: "rosario",
    date: "Jul 1, 2026",
    time: "11:00 AM",
    reason: "Root Canal",
    status: "pending",
  },
  {
    id: "apt-005",
    referenceNo: "REF-20260701-005",
    patientName: "Vegie Cueto",
    contactNumber: "+63 922 111 2222",
    branch: "san-juan",
    date: "Jul 1, 2026",
    time: "1:00 PM",
    reason: "Tooth Whitening",
    status: "cancelled",
  },
  {
    id: "apt-006",
    referenceNo: "REF-20260702-001",
    patientName: "Orlando Dela Cruz",
    contactNumber: "+63 918 333 4444",
    branch: "rosario",
    date: "Jul 2, 2026",
    time: "2:30 PM",
    reason: "Dental Checkup",
    status: "confirmed",
  },
  {
    id: "apt-007",
    referenceNo: "REF-20260702-002",
    patientName: "Kwajalene Kent Si...",
    contactNumber: "+63 905 555 6666",
    branch: "san-juan",
    date: "Jul 6, 2026",
    time: "11:30 AM",
    reason: "Teeth Cleaning",
    status: "pending",
  },
  {
    id: "apt-008",
    referenceNo: "REF-20260702-003",
    patientName: "Bailey Celine Sinu...",
    contactNumber: "+63 910 777 8888",
    branch: "rosario",
    date: "Jul 6, 2026",
    time: "10:30 AM",
    reason: "Tooth Filling",
    status: "confirmed",
  },
  {
    id: "apt-009",
    referenceNo: "REF-20260710-001",
    patientName: "Nica Galabit",
    contactNumber: "+63 919 000 1111",
    branch: "san-juan",
    date: "Jul 10, 2026",
    time: "11:00 PM",
    reason: "Dental Checkup",
    status: "pending",
  },
  {
    id: "apt-010",
    referenceNo: "REF-20260712-001",
    patientName: "Sara Johnson",
    contactNumber: "+63 917 222 3333",
    branch: "rosario",
    date: "Jul 12, 2026",
    time: "10:15 AM",
    reason: "Tooth Extraction",
    status: "confirmed",
  },
];

// ── Page metadata ────────────────────────────────────────────────────────────
export const PAGE_TITLE = "Appointments";
export const ADD_BUTTON_LABEL = "Add Appointment";

// ── Filter options ───────────────────────────────────────────────────────────
export const BRANCH_OPTIONS = [
  { value: "all", label: "All Branches" },
  { value: "san-juan", label: "San Juan" },
  { value: "rosario", label: "Rosario" },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// ── Status badge config ──────────────────────────────────────────────────────
export const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#11D896",
    bg: "rgba(17,216,150,0.2)",
  },
  pending: { label: "Pending", color: "#F2B90F", bg: "rgba(242,185,15,0.2)" },
  confirmed: {
    label: "Confirmed",
    color: "#1976D2",
    bg: "rgba(25,118,210,0.2)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#F81313",
    bg: "rgba(247,18,18,0.2)",
  },
};

// ── Branch badge config ──────────────────────────────────────────────────────
export const BRANCH_CONFIG = {
  "san-juan": {
    label: "San Juan",
    color: "#E963C8",
    bg: "rgba(233,99,200,0.2)",
  },
  rosario: { label: "Rosario", color: "#B388FF", bg: "rgba(179,136,255,0.2)" },
};

// ── Table column definitions ─────────────────────────────────────────────────
export const TABLE_COLUMNS = [
  { key: "referenceNo", label: "Reference No" },
  { key: "patientName", label: "Patient Name" },
  { key: "contactNumber", label: "Contact Number" },
  { key: "branch", label: "Branch" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", center: true },
];

export default appointments;
