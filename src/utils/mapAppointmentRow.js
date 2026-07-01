// src/utils/mapAppointmentRow.js
import dayjs from "dayjs";
import { dbStatusToForm } from "../services/appointments";

export function mapAppointmentRow(apt) {
  const rawDate = dayjs(apt.confirmed_date ?? apt.preferred_date).format(
    "YYYY-MM-DD",
  );
  const rawTime = dayjs(
    apt.confirmed_time ?? apt.preferred_time,
    "HH:mm:ss",
  ).format("HH:mm:ss");
  return {
    id: apt.id,
    referenceNo: apt.reference_number,
    patientName:
      `${apt.patient?.first_name ?? ""} ${apt.patient?.last_name ?? ""}`.trim(),
    contactNumber: apt.patient?.phone_number ?? "",
    branch: apt.service_branch?.branch?.id,
    branchName: apt.service_branch?.branch?.name,
    serviceBranchId: apt.service_branch_id,
    date: dayjs(apt.confirmed_date ?? apt.preferred_date).format("MMM D, YYYY"),
    time: dayjs(apt.confirmed_time ?? apt.preferred_time, "HH:mm:ss").format(
      "h:mm A",
    ),
    reason: apt.snapshot_service_name ?? apt.service_branch?.service?.name,
    status: dbStatusToForm(apt.approval_status, apt.appointment_status),
    rawDate, // for sorting
    rawTime, // for sorting
    createdAt: apt.created_at, // ISO timestamp for sorting tie-breaker
  };
}
