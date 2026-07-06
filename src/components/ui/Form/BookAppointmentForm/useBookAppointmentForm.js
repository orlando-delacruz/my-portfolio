// src/components/ui/Form/BookAppointmentForm/useBookAppointmentForm.js
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useAppointmentAvailability } from "../../../../hooks/useAppointmentAvailability";
import { bookPublicAppointment } from "../../../../services/publicBooking";
import { getRawPhoneDigits } from "../../../../utils/phoneFormatter";

dayjs.extend(isBetween);

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
  const isMounted = useRef(true);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  // ✅ Stabilize date keys (strings)
  const selectedDateRaw = fields.date;
  const selectedDateKey = useMemo(() => {
    return selectedDateRaw ? dayjs(selectedDateRaw).format("YYYY-MM-DD") : null;
  }, [selectedDateRaw]);

  const monthKey = useMemo(() => {
    return selectedDateKey ? selectedDateKey.slice(0, 7) : null;
  }, [selectedDateKey]);

  const {
    disabledTime,
    isDateFullyBooked,
    isSelectedDateClosed,
    loading: availabilityLoading,
    error: availabilityError,
  } = useAppointmentAvailability(fields.branchId, selectedDateKey, monthKey);


  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // disabledDate: only block past dates
  const disabledDate = useCallback(
    (current) => {
      if (!fields.branchId) return true;
      if (!current) return false;
      return current.startOf("day").isBefore(dayjs().startOf("day"));
    },
    [fields.branchId]
  );

  const updateFields = useCallback((newFields) => {
    setFields((prev) => ({ ...prev, ...newFields }));
  }, []);

  // Clear time when date becomes unavailable
  const clearedRef = useRef(false);
  useEffect(() => {
    if (fields.date && (isSelectedDateClosed || isDateFullyBooked)) {
      if (fields.time && !clearedRef.current) {
        clearedRef.current = true;
        updateFields({ time: "" });
        form?.setFieldsValue({ time: null });
      }
    } else {
      clearedRef.current = false;
    }
  }, [fields.date, isSelectedDateClosed, isDateFullyBooked, fields.time, form, updateFields]);

  const handleSubmit = useCallback(
    async (values) => {
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

        if (appointment?.id) {
          fetch("/api/send-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentId: appointment.id }),
          }).catch((err) => console.error("Confirmation email failed:", err));
        }
      } catch (err) {
        console.error("Booking error:", err);
        setErrors({ form: err.message || "Failed to book." });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setFields(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
    form?.resetFields();
  }, [form]);

  return {
    fields,
    errors,
    loading: loading || availabilityLoading || branchesLoading || servicesLoading,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    disabledTime,
    disabledDate,
    isDateFullyBooked,
    isSelectedDateClosed,
    availabilityError,
    handleSubmit,
    handleReset,
    updateFields,
    setErrors,
  };
}