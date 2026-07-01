// src/components/admin/Modal/AppointmentModal/appointmentFormSchema.js
export const STATUS_OPTIONS_FORM = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const EMPTY_FORM = {
  patientName: "",
  contactNumber: "",
  branch: undefined,
  date: null,
  time: null,
  reason: undefined,
  status: "pending",
};
