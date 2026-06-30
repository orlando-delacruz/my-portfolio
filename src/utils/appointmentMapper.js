import dayjs from "dayjs";
import { dbStatusToForm } from "../services/appointments";

export function toAppointmentRow(apt) {
  return {
    id: apt.id,
    referenceNo: apt.reference_number,
    patientName:
      `${apt.patients?.first_name ?? ""} ${apt.patients?.last_name ?? ""}`.trim(),
    contactNumber: apt.patients?.phone_number ?? "",
    branch: apt.service_branches?.branch_id,
    serviceBranchId: apt.service_branch_id,
    date: dayjs(apt.confirmed_date ?? apt.preferred_date).format("MMM D, YYYY"),
    time: dayjs(apt.confirmed_time ?? apt.preferred_time, "HH:mm:ss").format(
      "h:mm A",
    ),
    reason: apt.snapshot_service_name ?? apt.service_branches?.services?.name,
    status: dbStatusToForm(apt.approval_status, apt.appointment_status),
  };
}
