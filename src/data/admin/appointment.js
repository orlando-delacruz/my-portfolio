// src/data/admin/appointment.js

export const PAGE_TITLE = "Appointments";
export const ADD_BUTTON_LABEL = "Add Appointment";

export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

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
