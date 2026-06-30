// src/components/admin/Modal/AppointmentModal/useAppointmentModal.js
import { useState, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useAuthStore } from "../../../../store/authStore";
import { findOrCreatePatient } from "../../../../services/patients";
import { fetchServiceBranchById } from "../../../../services/serviceBranches";
import {
  adminCreateAppointment,
  adminRescheduleAppointment,
  dbStatusToForm,
} from "../../../../services/appointments";

// Converts a raw Supabase appointment row (with joined relations) into the
// flat shape the Appointments table/UI expects (see src/data/admin/appointment.js)
function toRow(apt) {
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

const useAppointmentModal = ({ onAddSuccess, onRescheduleSuccess } = {}) => {
  const profile = useAuthStore((s) => s.profile);

  // ── Add modal ─────────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const openAdd = useCallback(() => setAddOpen(true), []);
  const closeAdd = useCallback(() => setAddOpen(false), []);

  const handleAdd = useCallback(
    async (values, form) => {
      setAddLoading(true);
      try {
        const patient = await findOrCreatePatient({
          patientName: values.patientName,
          contactNumber: values.contactNumber,
        });
        const serviceBranch = await fetchServiceBranchById(values.reason);

        const created = await adminCreateAppointment({
          patient,
          serviceBranch,
          date: dayjs(values.date),
          time: dayjs(values.time),
          adminId: profile?.id,
        });

        const newRecord = toRow({
          ...created,
          patients: patient,
          service_branches: {
            branch_id: values.branch,
            services: { name: serviceBranch.name },
          },
        });

        message.success(`Appointment for ${newRecord.patientName} added!`);
        form.resetFields();
        setAddOpen(false);
        onAddSuccess?.(newRecord);
      } catch (err) {
        console.error(err);
        message.error("Failed to add appointment. Please try again.");
      } finally {
        setAddLoading(false);
      }
    },
    [onAddSuccess, profile],
  );

  // ── Reschedule modal ──────────────────────────────────────────────────────
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const openReschedule = useCallback((appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleOpen(true);
  }, []);

  const closeReschedule = useCallback(() => {
    setRescheduleOpen(false);
    setRescheduleTarget(null);
  }, []);

  const handleReschedule = useCallback(
    async (values, form) => {
      if (!rescheduleTarget) return;
      setRescheduleLoading(true);
      try {
        const updated = await adminRescheduleAppointment({
          appointmentId: rescheduleTarget.id,
          date: dayjs(values.date),
          time: dayjs(values.time),
          status: values.status,
          adminId: profile?.id,
        });

        const row = toRow(updated);

        message.success(`Appointment for ${row.patientName} updated!`);
        form.resetFields();
        setRescheduleOpen(false);
        setRescheduleTarget(null);
        onRescheduleSuccess?.(row);
      } catch (err) {
        console.error(err);
        message.error("Failed to update appointment. Please try again.");
      } finally {
        setRescheduleLoading(false);
      }
    },
    [rescheduleTarget, onRescheduleSuccess, profile],
  );

  return {
    addOpen,
    addLoading,
    openAdd,
    closeAdd,
    handleAdd,

    rescheduleOpen,
    rescheduleLoading,
    rescheduleTarget,
    openReschedule,
    closeReschedule,
    handleReschedule,
  };
};

export default useAppointmentModal;
