import { useState, useCallback } from "react";
import { supabase } from "../../../../services/supabase/supabase";

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  facebookName: "",
  branch: "",
  service: "",
  date: "",
  time: "",
  chiefComplaint: "",
};

const validate = (fields) => {
  const errors = {};
  if (!fields.firstName.trim()) errors.firstName = "First name is required.";
  if (!fields.lastName.trim()) errors.lastName = "Last name is required.";

  if (!fields.mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^(09|\+639)\d{9}$/.test(fields.mobile.trim())) {
    errors.mobile = "Enter a valid PH mobile number (e.g. 09123456789).";
  }

  if (!fields.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!fields.branch) errors.branch = "Please choose a branch.";
  if (!fields.service) errors.service = "Please choose a service.";
  if (!fields.date) errors.date = "Please select a preferred date.";
  if (!fields.time) errors.time = "Please select a preferred time.";

  return errors;
};

// Generate a short reference number e.g. "LBD-20250629-A3F2"
function generateReferenceNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LBD-${date}-${rand}`;
}

export const useBookAppointmentForm = () => {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleBranchChange = useCallback((value) => {
    setFields((prev) => ({ ...prev, branch: value, service: "" })); // reset service on branch change
    setErrors((prev) => ({ ...prev, branch: undefined }));
  }, []);

  const handleServiceChange = useCallback((value) => {
    setFields((prev) => ({ ...prev, service: value }));
    setErrors((prev) => ({ ...prev, service: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validate(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        document.getElementById(Object.keys(validationErrors)[0])?.focus();
        return;
      }

      setLoading(true);
      try {
        // 1. Find or create patient by phone number (business rule from v3 design)
        let patientId;
        const { data: existing } = await supabase
          .from("patients")
          .select("id")
          .eq("phone_number", fields.mobile.trim())
          .maybeSingle();

        if (existing) {
          patientId = existing.id;
        } else {
          const { data: newPatient, error: patientError } = await supabase
            .from("patients")
            .insert({
              first_name: fields.firstName.trim(),
              last_name: fields.lastName.trim(),
              email: fields.email.trim(),
              phone_number: fields.mobile.trim(),
              patient_number: `P-${Date.now()}`, // replace with a proper sequence if needed
            })
            .select("id")
            .single();
          if (patientError) throw patientError;
          patientId = newPatient.id;
        }

        // 2. Fetch service_branch snapshot data (price + duration at booking time)
        const { data: sb, error: sbError } = await supabase
          .from("service_branches")
          .select("price, duration_minutes, services(name)")
          .eq("id", fields.service)
          .single();
        if (sbError) throw sbError;

        // 3. Create appointment
        const { error: apptError } = await supabase
          .from("appointments")
          .insert({
            reference_number: generateReferenceNumber(),
            patient_id: patientId,
            service_branch_id: fields.service,
            booked_by: "website",
            preferred_date: fields.date,
            preferred_time: fields.time,
            chief_complaint: fields.chiefComplaint.trim() || null,
            approval_status: "waiting",
            appointment_status: "scheduled",
            notification_method: "email",
            // Snapshot fields — preserved even if service price changes later
            snapshot_service_name: sb.services?.name ?? null,
            snapshot_price: sb.price ?? null,
            snapshot_duration_minutes: sb.duration_minutes ?? null,
          });
        if (apptError) throw apptError;

        setSubmitted(true);
        setFields(INITIAL_STATE);
      } catch {
        setErrors({ form: "Something went wrong. Please try again." });
      } finally {
        setLoading(false);
      }
    },
    [fields],
  );

  const handleReset = useCallback(() => {
    setSubmitted(false);
    setErrors({});
    setFields(INITIAL_STATE);
  }, []);

  return {
    fields,
    errors,
    loading,
    submitted,
    handleChange,
    handleBranchChange,
    handleServiceChange,
    handleSubmit,
    handleReset,
  };
};
