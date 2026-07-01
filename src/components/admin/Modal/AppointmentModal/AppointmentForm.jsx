// src/components/admin/Modal/AppointmentModal/AppointmentForm.jsx
import { memo, useEffect, useCallback, useRef } from "react";
import { Form, Input, Select, DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { STATUS_OPTIONS_FORM } from "./appointmentFormSchema";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import * as S from "./AppointmentModal.styled";

const { Option } = Select;

// ── Phone formatting ──────────────────────────────────────────────────────────
function formatPhoneNumber(value) {
  const cleaned = value.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+63")) {
    const digits = cleaned.slice(3).slice(0, 10);
    if (digits.length <= 3) return `+63 ${digits}`;
    if (digits.length <= 6) return `+63 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `+63 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  if (cleaned.startsWith("0")) {
    const digits = cleaned.slice(0, 11);
    const rest = digits.slice(1);
    if (rest.length <= 3) return `0${rest}`;
    if (rest.length <= 6) return `0${rest.slice(0, 3)} ${rest.slice(3)}`;
    return `0${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
  }

  return value;
}

function validatePhone(value) {
  if (!value) return Promise.reject("Contact number is required.");
  const stripped = value.replace(/\s/g, "");
  if (!/^(\+63|0)\d{10}$/.test(stripped)) {
    return Promise.reject(
      "Enter a valid PH number (e.g. 0909 598 4478 or +63 912 345 6789)."
    );
  }
  return Promise.resolve();
}

// ── Time restrictions ─────────────────────────────────────────────────────────
// Mon–Thu, Sat–Sun : 10:30 AM – 5:00 PM
// Friday           : 10:30 AM – 4:00 PM
function getDisabledTime(selectedDate) {
  const isFriday = selectedDate ? dayjs(selectedDate).day() === 5 : false;
  const lastHour = isFriday ? 16 : 17; // 4 PM or 5 PM

  return {
    disabledHours: () => [
      ...Array.from({ length: 10 }, (_, i) => i),                              // 0–9
      ...Array.from({ length: 23 - lastHour }, (_, i) => lastHour + 1 + i),   // after lastHour
    ],
    disabledMinutes: (h) => {
      if (h === 10) return Array.from({ length: 30 }, (_, i) => i); // 0–29 at 10 AM
      if (h === lastHour) return Array.from({ length: 59 }, (_, i) => i + 1); // :01–:59 at close hour
      return [];
    },
    disabledSeconds: () => [],
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
const AppointmentForm = memo(({ form, showStatus = false }) => {
  const { branches, loading: branchesLoading } = useBranches();
  const selectedBranch = Form.useWatch("branch", form);
  const selectedDate = Form.useWatch("date", form);
  const { serviceBranches, loading: servicesLoading } = useServiceBranches(selectedBranch);

  const prevBranchRef = useRef(selectedBranch);

  useEffect(() => {
    if (
      prevBranchRef.current !== undefined &&
      prevBranchRef.current !== selectedBranch
    ) {
      form.setFieldValue("reason", undefined);
    }
    prevBranchRef.current = selectedBranch;
  }, [selectedBranch, form]);

  const disabledTime = useCallback(
    () => getDisabledTime(selectedDate),
    [selectedDate]
  );

  const handlePhoneChange = useCallback(
    (e) => {
      const formatted = formatPhoneNumber(e.target.value);
      form.setFieldValue("contactNumber", formatted);
    },
    [form]
  );

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <S.FormGrid>
        {/* Patient Name */}
        <Form.Item
          name="patientName"
          label="Patient Name"
          rules={[
            { required: true, message: "Patient name is required." },
            { min: 2, message: "Name must be at least 2 characters." },
            {
              pattern: /^[a-zA-Z\s.'-]+$/,
              message: "Name contains invalid characters.",
            },
          ]}
        >
          <Input placeholder="e.g. Juan Dela Cruz" maxLength={80} />
        </Form.Item>

        {/* Contact Number */}
        <Form.Item
          name="contactNumber"
          label="Contact Number"
          rules={[{ validator: (_, value) => validatePhone(value) }]}
        >
          <Input
            placeholder="0909 598 4478"
            maxLength={16}
            onChange={handlePhoneChange}
          />
        </Form.Item>

        {/* Branch */}
        <Form.Item
          name="branch"
          label="Branch"
          rules={[{ required: true, message: "Please select a branch." }]}
        >
          <Select placeholder="Select branch" loading={branchesLoading}>
            {branches.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Reason */}
        <Form.Item
          name="reason"
          label="Reason for Visit"
          rules={[{ required: true, message: "Please select a reason." }]}
        >
          <Select
            placeholder={selectedBranch ? "Select reason" : "Select a branch first"}
            loading={servicesLoading}
            disabled={!selectedBranch}
          >
            {serviceBranches.map((sb) => (
              <Option key={sb.service_branch_id} value={sb.service_branch_id}>
                {sb.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Preferred Date */}
        <Form.Item
          name="date"
          label="Preferred Date"
          rules={[{ required: true, message: "Please pick a date." }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="MMM D, YYYY"
            placeholder="Select date"
          />
        </Form.Item>

        {/* Preferred Time - NOW WITH ANY MINUTE AND NO SCROLLBAR */}
        <Form.Item
          name="time"
          label="Preferred Time"
          extra={
            selectedDate && dayjs(selectedDate).day() === 5
              ? "Friday hours: 10:30 AM – 4:00 PM"
              : "Clinic hours: 10:30 AM – 5:00 PM"
          }
          rules={[{ required: true, message: "Please pick a time." }]}
        >
          <TimePicker
            style={{ width: "100%" }}
            format="h:mm A"
            use12Hours
            placeholder="Select time"
            // Removed minuteStep to allow any minute
            disabledTime={disabledTime}
            hideDisabledOptions
            // Hide scrollbar via popupStyle
            popupStyle={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            // Also add a class for webkit
            popupClassName="time-picker-no-scrollbar"
          />
        </Form.Item>

        {/* Status — only shown in Reschedule */}
        {showStatus && (
          <S.FullWidth>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status." }]}
            >
              <Select placeholder="Select status">
                {STATUS_OPTIONS_FORM.map((o) => (
                  <Option key={o.value} value={o.value}>
                    {o.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </S.FullWidth>
        )}
      </S.FormGrid>
    </Form>
  );
});

AppointmentForm.displayName = "AppointmentForm";
export default AppointmentForm;