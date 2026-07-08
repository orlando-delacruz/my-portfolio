// src/pages/public/BookAppointment/useBookAppointmentForm.js
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useBranches } from '../../../hooks/useBranches';
import { useServiceBranches } from '../../../hooks/useServiceBranches';
import { useAppointmentAvailability } from '../../../hooks/useAppointmentAvailability';
import { bookPublicAppointment } from '../../../services/publicBooking';
import { getRawPhoneDigits } from '../../../utils/phoneFormatter';
import { useSearchParams } from 'react-router-dom';

dayjs.extend(isBetween);

const INITIAL_STATE = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  gender: '',
  email: '',
  phoneNumber: '',
  address: '',
  branchId: '',
  serviceBranchId: '',
  date: '',
  time: '',
  notes: '',
};

export function useBookAppointmentForm(form) {
  const [searchParams] = useSearchParams();
  const preSelectedServiceId = searchParams.get('serviceId');

  const [fields, setFields] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const isMounted = useRef(true);
  const initialPreselectDone = useRef(false);

  const { branches, loading: branchesLoading } = useBranches();
  const { serviceBranches: services, loading: servicesLoading } =
    useServiceBranches(fields.branchId);

  // Pre-select service if serviceId is in URL.
  // This effect runs once when services are loaded and a matching service is found.
  // The state update is conditional and guarded by a ref, so it does not cause
  // cascading renders. The ESLint warning is suppressed because it's a controlled
  // one-time initialization, not a continuous sync.
  useEffect(() => {
    if (preSelectedServiceId && !initialPreselectDone.current && !servicesLoading && services.length > 0) {
      const matchingService = services.find(s => s.service_branch_id === preSelectedServiceId);
      if (matchingService) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFields(prev => ({ ...prev, serviceBranchId: preSelectedServiceId }));
        form?.setFieldsValue({ serviceBranchId: preSelectedServiceId });
        initialPreselectDone.current = true;
      }
    }
  }, [preSelectedServiceId, services, servicesLoading, form]);

  const selectedDateRaw = fields.date;
  const selectedDateKey = useMemo(() => {
    return selectedDateRaw ? dayjs(selectedDateRaw).format('YYYY-MM-DD') : null;
  }, [selectedDateRaw]);

  const monthKey = useMemo(() => {
    return selectedDateKey ? selectedDateKey.slice(0, 7) : null;
  }, [selectedDateKey]);

  const {
    allSlots,
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
    null // no exclude for public booking
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
      if (current.startOf('day').isBefore(dayjs().startOf('day'))) return true;
      const dateStr = current.format('YYYY-MM-DD');
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
        updateFields({ time: '' });
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
        setErrors({ phoneNumber: 'Contact number is required.' });
        return;
      }
      if (!/^(\+63|0)\d{10}$/.test(phoneDigits)) {
        setErrors({ phoneNumber: 'Enter a valid Philippine number.' });
        return;
      }

      setIsSubmitting(true);
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

        message.success('Appointment booked successfully!');
        setSubmitted(true);
      } catch (err) {
        console.error('Booking error:', err);
        setErrors({ form: err.message || 'Failed to book.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setFields(INITIAL_STATE);
    setErrors({});
    setSubmitted(false);
    form?.resetFields();
    initialPreselectDone.current = false;
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
    allSlots,
    disabledDate,
    isDateFullyBooked,
    isSelectedDateClosed,
    isClosureDate,
    closureVersion,
    schedulingVersion,
    availabilityError,
    handleSubmit,
    handleReset,
    updateFields,
    setErrors,
  };
}