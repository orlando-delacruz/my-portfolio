// src/components/admin/Modal/AppointmentModal/appointmentFormSchema.js
export const STATUS_OPTIONS_FORM = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export const EMPTY_FORM = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthDate: null,
  gender: "",
  email: "",
  phoneNumber: "",
  address: "",
  branchId: undefined,
  serviceBranchId: undefined,
  date: null,
  time: null,
  status: "pending",
  notes: "",
};
