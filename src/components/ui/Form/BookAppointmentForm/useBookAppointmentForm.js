// src/components/ui/Form/BookAppointmentForm/useBookAppointmentForm.js
import { useState, useCallback, useEffect } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useScheduling } from "../../../../hooks/useScheduling";
import { bookPublicAppointment } from "../../../../services/publicBooking";
import { supabase } from "../../../../services/supabase/supabase";

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

const validateForm = (fields) => {
  const errors = {};
  if (!fields.firstName?.trim()) errors.firstName = "First name is required.";
  if (!fields.lastName?.trim()) errors.lastName = "Last name is required.";
  if (!fields.phoneNumber?.trim())
    errors.phoneNumber = "Contact number is required.";
  else if (!/^(\+63|0)\d{10}$/.test(fields.phoneNumber.replace(/\s/g, ""))) {
    errors.phoneNumber =
      "Enter a valid Philippine number (e.g., 09123456789 or +639123456789).";
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (fields.birthDate && dayjs(fields.birthDate).isAfter(dayjs(), "day")) {
    errors.birthDate = "Birthdate cannot be in the future.";
  }
  if (!fields.birthDate) errors.birthDate = "Birthdate is required.";
  if (!fields.branchId) errors.branchId = "Please select a branch.";
  if (!fields.serviceBranchId)
    errors.serviceBranchId = "Please select a service.";
  if (!fields.date) errors.date = "Please select a date.";
  else if (dayjs(fields.date).isBefore(dayjs(), "day")) {
    errors.date = "Date cannot be in the past.";
  }
  if (!fields.time) errors.time = "Please select a time.";
  return errors;
};

export function useBookAppointmentForm() {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [closures, setClosures] = useState([]);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  // Scheduling hook for disabled times
  const selectedDate = fields.date ? dayjs(fields.date) : null;
  const { disabledTime } = useScheduling(fields.branchId, selectedDate);

  // Fetch closures for the selected branch
  useEffect(() => {
    async function loadClosures() {
      if (!fields.branchId) {
        setClosures([]);
        return;
      }
      try {
        const start = dayjs().subtract(1, "month").format("YYYY-MM-DD");
        const end = dayjs().add(2, "months").format("YYYY-MM-DD");
        const { data, error } = await supabase
          .from("clinic_closures")
          .select("start_date, end_date")
          .eq("branch_id", fields.branchId)
          .eq("is_cancelled", false)
          .eq("affects_booking", true)
          .or(`start_date.lte.${end},end_date.gte.${start}`);
        if (error) throw error;
        setClosures(data || []);
      } catch (err) {
        console.error("Failed to load closures:", err);
        setClosures([]);
      }
    }
    loadClosures();
  }, [fields.branchId]);

  // Synchronous disabledDate
  const disabledDate = useCallback(
    (current) => {
      if (!fields.branchId) return true;
      if (!current) return false;
      const dateStr = dayjs(current).format("YYYY-MM-DD");
      return closures.some((c) => {
        const start = dayjs(c.start_date);
        const end = dayjs(c.end_date);
        return dayjs(dateStr).isBetween(start, end, "day", "[]");
      });
    },
    [fields.branchId, closures],
  );

  const handleBranchChange = useCallback((e) => {
    const value = e.target.value;
    setFields((prev) => ({
      ...prev,
      branchId: value,
      serviceBranchId: "",
      date: "",
      time: "",
    }));
    setErrors((prev) => ({
      ...prev,
      branchId: undefined,
      serviceBranchId: undefined,
      date: undefined,
      time: undefined,
    }));
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFields((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors],
  );

  const handleDateChange = useCallback((date) => {
    setFields((prev) => ({
      ...prev,
      date: date ? dayjs(date).format("YYYY-MM-DD") : "",
      time: "",
    }));
    setErrors((prev) => ({ ...prev, date: undefined, time: undefined }));
  }, []);

  const handleTimeChange = useCallback((time) => {
    if (time && dayjs.isDayjs(time) && time.isValid()) {
      setFields((prev) => ({
        ...prev,
        time: time.format("HH:mm:ss"),
      }));
    } else {
      setFields((prev) => ({
        ...prev,
        time: "",
      }));
    }
    setErrors((prev) => ({ ...prev, time: undefined }));
  }, []);

  const handleBirthDateChange = useCallback((date) => {
    setFields((prev) => ({
      ...prev,
      birthDate: date ? dayjs(date).format("YYYY-MM-DD") : "",
    }));
    setErrors((prev) => ({ ...prev, birthDate: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validateForm(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (!fields.time || !dayjs(fields.time, "HH:mm:ss").isValid()) {
        setErrors({ ...errors, time: "Please select a valid time." });
        return;
      }

      setLoading(true);
      setErrors({});

      try {
        await bookPublicAppointment({
          firstName: fields.firstName.trim(),
          middleName: fields.middleName.trim() || undefined,
          lastName: fields.lastName.trim(),
          birthDate: fields.birthDate || undefined,
          gender: fields.gender || undefined,
          email: fields.email.trim() || undefined,
          phoneNumber: fields.phoneNumber.trim(),
          address: fields.address.trim() || undefined,
          branchId: fields.branchId,
          serviceBranchId: fields.serviceBranchId,
          date: fields.date,
          time: fields.time,
          notes: fields.notes.trim() || undefined,
        });

        message.success(
          "Appointment booked successfully! You will receive a confirmation email shortly.",
        );
        setSubmitted(true);
      } catch (err) {
        console.error("Booking error:", err);
        setErrors({
          form:
            err.message ||
            "Failed to book appointment. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [fields],
  );

  const handleReset = useCallback(() => {
    setFields(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
  }, []);

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
    handleChange,
    handleBranchChange,
    handleDateChange,
    handleTimeChange,
    handleBirthDateChange,
    handleSubmit,
    handleReset,
    setFields,
    setErrors,
  };
}
