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
  checkBookingConflictWithDetails,
} from "../../../../services/appointments";
import { getRawPhoneDigits } from "../../../../utils/phoneFormatter";
import { generateConflictMessage } from "../../../../utils/conflictMessage";

const useAppointmentModal = ({ onAddSuccess, onRescheduleSuccess } = {}) => {
  const profile = useAuthStore((s) => s.profile);

  // ── Add modal ──
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const openAdd = useCallback(() => setAddOpen(true), []);
  const closeAdd = useCallback(() => setAddOpen(false), []);

  const handleAdd = useCallback(
    async (values, form) => {
      setAddLoading(true);
      try {
        let patient;
        if (values.patientType === "ortho" && values.selectedOrthodonticPatient) {
          patient = values.selectedOrthodonticPatient;
        } else {
          patient = await findOrCreatePatient({
            firstName: values.firstName,
            middleName: values.middleName || "",
            lastName: values.lastName,
            birthDate: values.birthDate ? dayjs(values.birthDate).format("YYYY-MM-DD") : undefined,
            gender: values.gender,
            email: values.email || undefined,
            phoneNumber: getRawPhoneDigits(values.phoneNumber),
            address: values.address,
            isOrthodontic: values.isOrthodontic || false,
          });
        }

        const serviceBranch = await fetchServiceBranchById(values.serviceBranchId);
        const intervalMinutes = serviceBranch.duration_minutes || 30;

        const conflictCheck = await checkBookingConflictWithDetails({
          branchId: values.branchId,
          date: dayjs(values.date),
          time: dayjs(values.time),
          intervalMinutes,
        });
        if (conflictCheck.hasConflict) {
          const msg = generateConflictMessage(conflictCheck);
          message.error(msg);
          setAddLoading(false);
          return;
        }

        const created = await adminCreateAppointment({
          patient,
          serviceBranch,
          date: dayjs(values.date),
          time: dayjs(values.time),
          adminId: profile?.id,
          intervalMinutes,
        });

        const newRecord = toAppointmentRow({
          ...created,
          patients: patient,
          service_branches: {
            branch_id: values.branchId,
            services: { name: serviceBranch.name },
          },
        });

        message.success(`Appointment for ${newRecord.patientName} added!`);
        form.resetFields();
        setAddOpen(false);
        onAddSuccess?.(newRecord);

        // Email sending is removed – no EmailJS integration.
      } catch (err) {
        console.error(err);
        message.error(err.message || "Failed to add appointment. Please try again.");
      } finally {
        setAddLoading(false);
      }
    },
    [onAddSuccess, profile]
  );

  // ── Reschedule modal ──
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleTargetId, setRescheduleTargetId] = useState(null);

  const openReschedule = useCallback((appointmentId) => {
    setRescheduleTargetId(appointmentId);
    setRescheduleOpen(true);
  }, []);

  const closeReschedule = useCallback(() => {
    setRescheduleOpen(false);
    setRescheduleTargetId(null);
  }, []);

  const handleReschedule = useCallback(
    async (values, form) => {
      if (!rescheduleTargetId) return;
      setRescheduleLoading(true);
      try {
        const updated = await adminRescheduleAppointment({
          appointmentId: rescheduleTargetId,
          branchId: values.branchId,
          date: dayjs(values.date),
          time: dayjs(values.time),
          status: values.status,
          adminId: profile?.id,
          intervalMinutes: 30,
        });

        const row = toAppointmentRow(updated);
        message.success(`Appointment for ${row.patientName} updated!`);
        form.resetFields();
        setRescheduleOpen(false);
        setRescheduleTargetId(null);
        onRescheduleSuccess?.(row);
      } catch (err) {
        console.error(err);
        message.error(err.message || "Failed to reschedule appointment. Please try again.");
      } finally {
        setRescheduleLoading(false);
      }
    },
    [rescheduleTargetId, onRescheduleSuccess, profile]
  );

  return {
    addOpen,
    addLoading,
    openAdd,
    closeAdd,
    handleAdd,
    rescheduleOpen,
    rescheduleLoading,
    rescheduleTargetId,
    openReschedule,
    closeReschedule,
    handleReschedule,
  };
};

export default useAppointmentModal;