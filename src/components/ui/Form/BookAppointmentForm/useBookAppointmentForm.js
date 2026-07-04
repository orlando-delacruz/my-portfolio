// src/components/ui/Form/BookAppointmentForm/useBookAppointmentForm.js
import { useState, useCallback, useEffect, useRef } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useAppointmentAvailability } from "../../../../hooks/useAppointmentAvailability";
import { bookPublicAppointment } from "../../../../services/publicBooking";
import { supabase } from "../../../../services/supabase/supabase";
import { getRawPhoneDigits } from "../../../../utils/phoneFormatter";

const INITIAL_STATE = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthDate: "",
  gender: "",
  email: "",
  phoneNumber: "",
  address: "",
  branchId: "",
  serviceBranchId: "",
  date: "",
  time: "",
  notes: "",
};

export function useBookAppointmentForm(form) {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [closures, setClosures] = useState([]);
  const isMounted = useRef(true);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  const selectedDate = fields.date ? dayjs(fields.date) : null;
  const { disabledTime, isDateFullyBooked, isDateDisabled } =
    useAppointmentAvailability(fields.branchId, selectedDate);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    async function loadClosures() {
      if (!fields.branchId) {
        if (isMounted.current) setClosures([]);
        return;
      }
      try {
        const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
        const end = dayjs().add(2, "months").format("YYYY-MM-DD");
        const { data } = await supabase
          .from("clinic_closures")
          .select("start_date, end_date")
          .eq("branch_id", fields.branchId)
          .eq("is_cancelled", false)
          .eq("affects_booking", true)
          .or(`start_date.lte.${end},end_date.gte.${start}`);
        if (isMounted.current) setClosures(data || []);
      } catch (err) {
        console.error("Failed to load closures:", err);
        if (isMounted.current) setClosures([]);
      }
    }
    loadClosures();
  }, [fields.branchId]);

  const disabledDate = useCallback(
    (current) => {
      if (!fields.branchId) return true;
      if (!current) return false;
      const dateStr = dayjs(current).format("YYYY-MM-DD");
      const isClosure = closures.some((c) => {
        const start = dayjs(c.start_date);
        const end = dayjs(c.end_date);
        return dayjs(dateStr).isBetween(start, end, "day", "[]");
      });
      if (isClosure) return true;
      return isDateDisabled(current);
    },
    [fields.branchId, closures, isDateDisabled],
  );

  const updateFields = useCallback((newFields) => {
    setFields((prev) => ({ ...prev, ...newFields }));
  }, []);

  const handleSubmit = useCallback(async (values) => {
    const phoneDigits = getRawPhoneDigits(values.phoneNumber);
    if (!phoneDigits) {
      setErrors({ phoneNumber: "Contact number is required." });
      return;
    }
    if (!/^(\+63|0)\d{10}$/.test(phoneDigits)) {
      setErrors({ phoneNumber: "Enter a valid Philippine number." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const appointment = await bookPublicAppointment({
        firstName: values.firstName.trim(),
        middleName: values.middleName?.trim() || undefined,
        lastName: values.lastName.trim(),
        birthDate: values.birthDate || undefined,
        gender: values.gender || undefined,
        email: values.email?.trim() || undefined,
        phoneNumber: phoneDigits,
        address: values.address?.trim() || undefined,
        branchId: values.branchId,
        serviceBranchId: values.serviceBranchId,
        date: values.date,
        time: values.time,
        notes: values.notes?.trim() || undefined,
      });

      message.success("Appointment booked successfully!");
      setSubmitted(true);

      // ── Trigger confirmation email via Trigger.dev ──
      if (appointment?.id) {
        fetch("/api/trigger-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId: appointment.id }),
        }).catch((err) => console.error("Trigger confirmation failed:", err));
      }
    } catch (err) {
      console.error("Booking error:", err);
      setErrors({ form: err.message || "Failed to book." });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setFields(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
    form?.resetFields();
  }, [form]);

  return {
    fields,
    errors,
    loading,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    disabledTime,
    disabledDate,
    isDateFullyBooked,
    handleSubmit,
    handleReset,
    updateFields,
    setErrors,
  };
}
