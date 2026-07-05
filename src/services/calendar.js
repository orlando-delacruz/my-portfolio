// src/services/calendar.js
import { supabase } from "./supabase/supabase";
import dayjs from "dayjs";
import { getBranchColor, getBranchInitial } from "../utils/branchUtils";

function isValidUUID(str) {
  if (!str || typeof str !== "string") return false;
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(str.trim());
}

export async function fetchCalendarAppointments(
  month,
  branchId = null,
  statusFilter = "all",
) {
  console.log(
    "📌 fetchCalendarAppointments called with branchId:",
    branchId,
    "statusFilter:",
    statusFilter,
  );

  const startOfMonth = month.startOf("month").format("YYYY-MM-DD");
  const endOfMonth = month.endOf("month").format("YYYY-MM-DD");

  const dateFilter = `preferred_date.gte.${startOfMonth},preferred_date.lte.${endOfMonth},confirmed_date.gte.${startOfMonth},confirmed_date.lte.${endOfMonth}`;

  let query = supabase
    .from("appointments")
    .select(
      `
      id,
      reference_number,
      preferred_date,
      preferred_time,
      confirmed_date,
      confirmed_time,
      approval_status,
      appointment_status,
      snapshot_service_name,
      patient:patients(
        id,
        first_name,
        last_name,
        phone_number,
        email,
        is_orthodontic
      ),
      service_branch:service_branches(
        branch_id,
        branch:branches(id, name),
        service:services(name)
      )
    `,
    )
    .or(dateFilter)
    .order("preferred_date", { ascending: true });

  // Branch filter – only if valid UUID
  if (branchId && isValidUUID(branchId)) {
    query = query.eq("service_branch.branch_id", branchId);
  }

  // Status filter
  if (statusFilter && statusFilter !== "all") {
    if (statusFilter === "confirmed") {
      query = query
        .eq("approval_status", "approved")
        .eq("appointment_status", "scheduled");
    } else if (statusFilter === "pending") {
      query = query
        .eq("approval_status", "waiting")
        .eq("appointment_status", "scheduled");
    } else if (statusFilter === "completed") {
      query = query.eq("appointment_status", "completed");
    } else if (statusFilter === "cancelled") {
      query = query.eq("appointment_status", "cancelled");
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  // Transform data
  return (data || []).map((apt) => {
    const date = apt.confirmed_date || apt.preferred_date;
    const time = apt.confirmed_time || apt.preferred_time;
    const patient = apt.patient || {};
    const patientName =
      `${patient.first_name || ""} ${patient.last_name || ""}`.trim() ||
      "Unknown Patient";

    const serviceBranch = apt.service_branch || {};
    const branch = serviceBranch.branch || null;
    const branchId = serviceBranch.branch_id || null;
    const branchName = branch?.name || null;

    let branchInitial = "•";
    let branchColor = "#888888";
    if (branchName) {
      branchInitial = getBranchInitial(branchName);
      branchColor = getBranchColor(branchId, branchName);
    } else if (branchId) {
      branchInitial = branchId.slice(0, 1).toUpperCase();
      branchColor = getBranchColor(branchId);
    }

    let status = "pending";
    if (apt.appointment_status === "cancelled") status = "cancelled";
    else if (apt.appointment_status === "completed") status = "completed";
    else if (apt.approval_status === "approved") status = "confirmed";

    const serviceName =
      apt.snapshot_service_name || serviceBranch?.service?.name || "General";

    return {
      id: apt.id,
      date,
      time: time ? dayjs(time, "HH:mm:ss").format("h:mm A") : "TBD",
      patientName,
      branchId,
      branchName,
      branchInitial,
      branchColor,
      service: serviceName,
      status,
      isOrthodontic: patient.is_orthodontic || false,
      phoneNumber: patient.phone_number || "",
      appointment: apt,
    };
  });
}
