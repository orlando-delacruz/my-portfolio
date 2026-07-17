// api/_lib/format.js
export function formatAppointmentDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAppointmentTime(timeStr) {
  if (!timeStr) return "";
  return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
