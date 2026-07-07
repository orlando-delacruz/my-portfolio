// src/components/ui/AppointmentTimePicker/AppointmentTimePicker.jsx
import { memo } from 'react';
import { Select } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

/**
 * Renders a dropdown of available appointment times.
 * @param {string[]} availableSlots - Array of time strings in "HH:mm:ss" format.
 * @param {string} value - Currently selected time (HH:mm:ss).
 * @param {function} onChange - Callback when a time is selected.
 * @param {boolean} loading - Whether slots are being fetched.
 * @param {boolean} disabled - Whether the dropdown is disabled.
 */
const AppointmentTimePicker = memo(({
  availableSlots = [],
  value,
  onChange,
  loading = false,
  disabled = false,
}) => {
  // Format time for display (e.g., "10:30 AM")
  const formatDisplay = (timeStr) => {
    return dayjs(timeStr, 'HH:mm:ss').format('h:mm A');
  };

  return (
    <Select
      placeholder="Select time"
      value={value || undefined}
      onChange={onChange}
      loading={loading}
      disabled={disabled || availableSlots.length === 0}
      style={{ width: '100%' }}
      size="large"
      showSearch={false}
    >
      {availableSlots.map((slot) => (
        <Option key={slot} value={slot}>
          {formatDisplay(slot)}
        </Option>
      ))}
    </Select>
  );
});

AppointmentTimePicker.displayName = 'AppointmentTimePicker';
export default AppointmentTimePicker;