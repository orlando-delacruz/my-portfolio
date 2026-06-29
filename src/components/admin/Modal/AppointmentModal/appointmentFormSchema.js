// Shared between Add and Reschedule modal forms

export const BRANCH_OPTIONS = [
  { value: "rosario", label: "Rosario Branch" },
  { value: "san-juan", label: "San Juan Branch" },
];

export const REASON_OPTIONS = [
  { value: "Dental Checkup", label: "Dental Checkup" },
  { value: "Teeth Cleaning", label: "Teeth Cleaning" },
  { value: "Tooth Extraction", label: "Tooth Extraction" },
  { value: "Tooth Filling", label: "Tooth Filling" },
  { value: "Root Canal", label: "Root Canal" },
  { value: "Teeth Whitening", label: "Teeth Whitening" },
  { value: "Orthodontics / Braces", label: "Orthodontics / Braces" },
  { value: "Pediatric Dentistry", label: "Pediatric Dentistry" },
  { value: "Other", label: "Other" },
];

export const STATUS_OPTIONS_FORM = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Initial empty values for Add form
export const EMPTY_FORM = {
  patientName: "",
  contactNumber: "",
  branch: undefined,
  date: null,
  time: null,
  reason: undefined,
  status: "pending",
};
