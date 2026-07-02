// src/components/ui/Form/BookAppointmentForm/useBookAppointmentForm.js
import { useState, useCallback, useEffect, useRef } from "react";
import { message } from "antd";
import dayjs from "dayjs";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useScheduling } from "../../../../hooks/useScheduling";
import { bookPublicAppointment } from "../../../../services/publicBooking";
import { checkBookingConflictWithDetails } from "../../../../services/appointments";
import { supabase } from "../../../../services/supabase/supabase";
import { getRawPhoneDigits } from "../../../../utils/phoneFormatter";
import { generateConflictMessage } from "../../../../utils/conflictMessage";

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
  const [availabilityError, setAvailabilityError] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const isMounted = useRef(true);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  const selectedDate = fields.date ? dayjs(fields.date) : null;
  const { disabledTime } = useScheduling(fields.branchId, selectedDate);

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
      return closures.some((c) => {
        const start = dayjs(c.start_date);
        const end = dayjs(c.end_date);
        return dayjs(dateStr).isBetween(start, end, "day", "[]");
      });
    },
    [fields.branchId, closures],
  );

  // ── Availability check with detailed message ──
  const { branchId, date, time } = fields;

  useEffect(() => {
    let cancelled = false;

    const checkAvailability = async () => {
      if (!branchId || !date || !time) {
        if (!cancelled && isMounted.current) {
          setAvailabilityError(null);
          setCheckingAvailability(false);
        }
        return;
      }

      if (!cancelled && isMounted.current) {
        setCheckingAvailability(true);
      }

      try {
        const result = await checkBookingConflictWithDetails({
          branchId,
          date: dayjs(date),
          time: dayjs(time),
        });

        if (result.hasConflict) {
          const msg = generateConflictMessage(result);
          if (!cancelled && isMounted.current) setAvailabilityError(msg);
        } else {
          if (!cancelled && isMounted.current) setAvailabilityError(null);
        }
      } catch (err) {
        console.error("Availability check error:", err);
        if (!cancelled && isMounted.current) setAvailabilityError(null);
      } finally {
        if (!cancelled && isMounted.current) setCheckingAvailability(false);
      }
    };

    checkAvailability();

    return () => {
      cancelled = true;
    };
  }, [branchId, date, time]);

  // ── Handlers ──
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
      await bookPublicAppointment({
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
    setAvailabilityError(null);
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
    availabilityError,
    checkingAvailability,
    handleSubmit,
    handleReset,
    updateFields,
    setAvailabilityError,
  };
}
