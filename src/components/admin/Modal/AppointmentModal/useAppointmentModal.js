// src/components/admin/Modal/AppointmentModal/useAppointmentModal.js
import { useState, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useAuthStore } from "../../../../store/authStore";
import { findOrCreatePatient } from "../../../../services/patients";
import { fetchServiceBranchById } from "../../../../services/serviceBranches";
import { toAppointmentRow } from "../../../../utils/appointmentMapper";
import {
  adminCreateAppointment,
  adminRescheduleAppointment,
} from "../../../../services/appointments";

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

        const newRecord = toAppointmentRow({
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
        message.error(
          err.message || "Failed to add appointment. Please try again.",
        );
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
          branchId: rescheduleTarget.branch,
          date: dayjs(values.date),
          time: dayjs(values.time),
          status: values.status,
          adminId: profile?.id,
        });

        const row = toAppointmentRow(updated);

        message.success(`Appointment for ${row.patientName} updated!`);
        form.resetFields();
        setRescheduleOpen(false);
        setRescheduleTarget(null);
        onRescheduleSuccess?.(row);
      } catch (err) {
        console.error(err);
        message.error(
          err.message || "Failed to add appointment. Please try again.",
        );
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
