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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMounted = useRef(true);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  const selectedService = useMemo(() => {
    if (!fields.serviceBranchId || !services.length) return null;
    return services.find((s) => s.service_branch_id === fields.serviceBranchId);
  }, [fields.serviceBranchId, services]);

  const durationMinutes = useMemo(() => {
    if (selectedService?.duration_minutes) return selectedService.duration_minutes;
    return 30;
  }, [selectedService]);

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
    isClosureDate,
    closureVersion,
    schedulingVersion,
    loading: availabilityLoading,
    error: availabilityError,
  } = useAppointmentAvailability(
    fields.branchId,
    selectedDateKey,
    monthKey,
    durationMinutes
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const disabledDate = useCallback(
    (current) => {
      if (!fields.branchId) return true;
      if (!current) return false;
      if (current.startOf("day").isBefore(dayjs().startOf("day"))) return true;
      const dateStr = current.format("YYYY-MM-DD");
      return isClosureDate(dateStr);
    },
    [fields.branchId, isClosureDate]
  );

  const updateFields = useCallback((newFields) => {
    setFields((prev) => ({ ...prev, ...newFields }));
  }, []);

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

      setIsSubmitting(true);
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
          durationMinutes,
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
        setIsSubmitting(false);
      }
    },
    [durationMinutes]
  );

  const handleReset = useCallback(() => {
    setFields(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
    form?.resetFields();
  }, [form]);

  const loading = isSubmitting || availabilityLoading || branchesLoading || servicesLoading;

  return {
    fields,
    errors,
    loading,
    isSubmitting,
    submitted,
    branches,
    services,
    branchesLoading,
    servicesLoading,
    disabledTime,
    disabledDate,
    isDateFullyBooked,
    isSelectedDateClosed,
    isClosureDate,
    closureVersion,
    schedulingVersion,
    durationMinutes,
    availabilityError,
    handleSubmit,
    handleReset,
    updateFields,
    setErrors,
  };
}