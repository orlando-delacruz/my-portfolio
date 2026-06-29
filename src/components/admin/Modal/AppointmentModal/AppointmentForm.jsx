import { memo } from "react";
import { Form, Input, Select, DatePicker, TimePicker } from "antd";
import { BRANCH_OPTIONS, REASON_OPTIONS, STATUS_OPTIONS_FORM } from "./appointmentFormSchema";
import * as S from "./AppointmentModal.styled";

const { Option } = Select;

/**
 * AppointmentForm
 * Pure UI — receives `form` instance from parent modal.
 * Used by both AddAppointmentModal and RescheduleModal.
 *
 * @param {object}  form         - Ant Design Form instance
 * @param {boolean} showStatus   - Show the Status field (reschedule only)
 */
const AppointmentForm = memo(({ form, showStatus = false }) => (
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
        rules={[
          { required: true, message: "Contact number is required." },
          {
            pattern: /^(\+63|0)\d{10}$/,
            message: "Enter a valid PH number (e.g. +639123456789 or 09123456789).",
          },
        ]}
      >
        <Input placeholder="+63 912 345 6789" maxLength={15} />
      </Form.Item>

      {/* Branch */}
      <Form.Item
        name="branch"
        label="Branch"
        rules={[{ required: true, message: "Please select a branch." }]}
      >
        <Select placeholder="Select branch">
          {BRANCH_OPTIONS.map((o) => (
            <Option key={o.value} value={o.value}>
              {o.label}
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
        <Select placeholder="Select reason">
          {REASON_OPTIONS.map((o) => (
            <Option key={o.value} value={o.value}>
              {o.label}
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

      {/* Preferred Time */}
      <Form.Item
        name="time"
        label="Preferred Time"
        rules={[{ required: true, message: "Please pick a time." }]}
      >
        <TimePicker
          style={{ width: "100%" }}
          format="h:mm A"
          use12Hours
          placeholder="Select time"
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
));

AppointmentForm.displayName = "AppointmentForm";
export default AppointmentForm;