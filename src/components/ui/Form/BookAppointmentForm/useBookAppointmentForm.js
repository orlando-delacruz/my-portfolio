// src/components/ui/Form/BookAppointmentForm/useBookAppointmentForm.js
import { useState, useCallback } from "react";

const INITIAL_STATE = {
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  facebookName: "",
  branch: "",
  date: "",
  time: "",
  reason: "",
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
  if (!fields.date) errors.date = "Please select a preferred date.";
  if (!fields.time) errors.time = "Please select a preferred time.";
  if (!fields.reason) errors.reason = "Please select a reason for your visit.";

  return errors;
};

export const useBookAppointmentForm = () => {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleBranchChange = useCallback((value) => {
    setFields((prev) => ({ ...prev, branch: value }));
    setErrors((prev) => ({ ...prev, branch: undefined }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const validationErrors = validate(fields);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Scroll to first error
        const firstErrorId = Object.keys(validationErrors)[0];
        document.getElementById(firstErrorId)?.focus();
        return;
      }

      setLoading(true);
      try {
        // TODO: Replace with real API call
        await new Promise((res) => setTimeout(res, 1200));
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
    handleSubmit,
    handleReset,
  };
};
