import { useState, useCallback } from "react";
import { message } from "antd";
import dayjs from "dayjs";

/**
 * useAppointmentModal
 *
 * Manages state and handlers for both Add and Reschedule modals.
 * Returns everything the modal UI needs — no JSX here.
 *
 * @param {function} onAddSuccess        — called after a successful Add
 * @param {function} onRescheduleSuccess — called after a successful Reschedule
 */
const useAppointmentModal = ({ onAddSuccess, onRescheduleSuccess } = {}) => {
  // ── Add modal ─────────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const openAdd = useCallback(() => setAddOpen(true), []);
  const closeAdd = useCallback(() => setAddOpen(false), []);

  const handleAdd = useCallback(
    async (values, form) => {
      setAddLoading(true);
      try {
        // TODO: replace with real Supabase insert
        await new Promise((res) => setTimeout(res, 700));

        const newRecord = {
          id: `apt-${Date.now()}`,
          referenceNo: `REF-${dayjs().format("YYYYMMDD")}-${Math.floor(Math.random() * 900 + 100)}`,
          patientName: values.patientName.trim(),
          contactNumber: values.contactNumber.trim(),
          branch: values.branch,
          date: dayjs(values.date).format("MMM D, YYYY"),
          time: dayjs(values.time).format("h:mm A"),
          reason: values.reason,
          status: values.status ?? "pending",
        };

        message.success(`Appointment for ${newRecord.patientName} added!`);
        form.resetFields();
        setAddOpen(false);
        onAddSuccess?.(newRecord);
      } catch {
        message.error("Failed to add appointment. Please try again.");
      } finally {
        setAddLoading(false);
      }
    },
    [onAddSuccess],
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
      setRescheduleLoading(true);
      try {
        // TODO: replace with real Supabase update
        await new Promise((res) => setTimeout(res, 700));

        const updated = {
          ...rescheduleTarget,
          patientName: values.patientName.trim(),
          contactNumber: values.contactNumber.trim(),
          branch: values.branch,
          date: dayjs(values.date).format("MMM D, YYYY"),
          time: dayjs(values.time).format("h:mm A"),
          reason: values.reason,
          status: values.status,
        };

        message.success(`Appointment for ${updated.patientName} updated!`);
        form.resetFields();
        setRescheduleOpen(false);
        setRescheduleTarget(null);
        onRescheduleSuccess?.(updated);
      } catch {
        message.error("Failed to update appointment. Please try again.");
      } finally {
        setRescheduleLoading(false);
      }
    },
    [rescheduleTarget, onRescheduleSuccess],
  );

  return {
    // Add
    addOpen,
    addLoading,
    openAdd,
    closeAdd,
    handleAdd,

    // Reschedule
    rescheduleOpen,
    rescheduleLoading,
    rescheduleTarget,
    openReschedule,
    closeReschedule,
    handleReschedule,
  };
};

export default useAppointmentModal;
