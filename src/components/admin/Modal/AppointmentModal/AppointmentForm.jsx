// src/components/admin/Modal/AppointmentModal/AppointmentForm.jsx
import { memo, useEffect, useCallback, useRef } from "react";
import { Form, Input, Select, DatePicker, TimePicker, Radio } from "antd";
import dayjs from "dayjs";
import { STATUS_OPTIONS_FORM } from "./appointmentFormSchema";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useAppointmentAvailability } from "../../../../hooks/useAppointmentAvailability";
import { formatPhoneDisplay, getRawPhoneDigits, isValidPhilippinePhone } from "../../../../utils/phoneFormatter";
import * as S from "./AppointmentModal.styled";

const { Option } = Select;

// ── Validators ──
const validatePhone = (_, value) => {
  if (!value) {
    return Promise.reject(new Error("Contact number is required."));
  }
  const stripped = getRawPhoneDigits(value);
  if (!isValidPhilippinePhone(stripped)) {
    return Promise.reject(
      new Error("Enter a valid PH number (e.g., 0909 598 4478 or +63 912 345 6789).")
    );
  }
  return Promise.resolve();
};

// ── Birthdate is now optional ──
const validateBirthDate = (_, value) => {
  if (!value) return Promise.resolve();
  if (dayjs(value).isAfter(dayjs(), "day")) {
    return Promise.reject(new Error("Birthdate cannot be in the future."));
  }
  return Promise.resolve();
};

const validateEmail = (_, value) => {
  if (!value) return Promise.resolve();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return Promise.reject(new Error("Please enter a valid email address."));
  }
  return Promise.resolve();
};

// ── Component ──
const AppointmentForm = memo(({
  form,
  showStatus = false,
  showPatientSelector = false,
  patientType = 'new',
  selectedOrthodonticPatient = null,
  orthodonticPatients = [],
  onPatientTypeChange,
  onOrthodonticPatientSelect,
  loadingOrthoPatients = false,
}) => {
  const { branches, loading: branchesLoading } = useBranches();
  const selectedBranch = Form.useWatch("branchId", form);
  const selectedDate = Form.useWatch("date", form);
  const { serviceBranches, loading: servicesLoading } = useServiceBranches(selectedBranch);

  const { disabledTime, isDateFullyBooked, isDateDisabled } = useAppointmentAvailability(
    selectedBranch,
    selectedDate
  );

  const handlePhoneChange = useCallback(
    (e) => {
      const raw = getRawPhoneDigits(e.target.value);
      if (raw.length > 11) {
        e.preventDefault();
        return;
      }
      const formatted = formatPhoneDisplay(raw);
      form.setFieldValue("phoneNumber", formatted);
    },
    [form]
  );

  const prevBranchRef = useRef(selectedBranch);
  useEffect(() => {
    if (prevBranchRef.current !== undefined && prevBranchRef.current !== selectedBranch) {
      form.setFieldValue("serviceBranchId", undefined);
    }
    prevBranchRef.current = selectedBranch;
  }, [selectedBranch, form]);

  const disabledDate = useCallback(
    (current) => {
      if (!selectedBranch) return true;
      if (!current) return false;
      return isDateDisabled(current);
    },
    [selectedBranch, isDateDisabled]
  );

  // ── Patient type change handler ──
  const handlePatientTypeChange = (e) => {
    const value = e.target.value;
    onPatientTypeChange?.(value);
    if (value === 'new') {
      form.setFieldsValue({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        birthDate: null,
        gender: '',
        address: '',
      });
    } else {
      form.setFieldsValue({
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        birthDate: null,
        gender: '',
        address: '',
      });
    }
  };

  // ── Orthodontic patient selection handler ──
  const handleOrthoPatientSelect = (patientId) => {
    if (!patientId) {
      onOrthodonticPatientSelect?.(null);
      return;
    }
    const patient = orthodonticPatients.find(p => p.id === patientId);
    if (patient) {
      onOrthodonticPatientSelect?.(patient);
      form.setFieldsValue({
        firstName: patient.first_name,
        middleName: patient.middle_name || '',
        lastName: patient.last_name,
        phoneNumber: patient.phone_number || '',
        email: patient.email || '',
        birthDate: patient.birth_date ? dayjs(patient.birth_date) : null,
        gender: patient.gender || '',
        address: patient.address || '',
      });
      form.setFieldValue('serviceBranchId', undefined);
    }
  };

  const isOrthoSelected = patientType === 'ortho' && selectedOrthodonticPatient !== null;

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <S.FormGrid>
        {/* ── Patient Type Selector (only in Add mode) ── */}
        {showPatientSelector && (
          <S.FullWidth>
            <Form.Item label="Patient Type" required>
              <Radio.Group
                value={patientType}
                onChange={handlePatientTypeChange}
                buttonStyle="solid"
              >
                <Radio.Button value="new">New Patient</Radio.Button>
                <Radio.Button value="ortho">Orthodontic Patient</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </S.FullWidth>
        )}

        {/* ── Orthodontic Patient Dropdown ── */}
        {showPatientSelector && patientType === 'ortho' && (
          <S.FullWidth>
            <Form.Item
              label="Select Orthodontic Patient"
              rules={[{ required: true, message: "Please select an orthodontic patient." }]}
            >
              <Select
                placeholder="Search orthodontic patients..."
                loading={loadingOrthoPatients}
                onChange={handleOrthoPatientSelect}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={selectedOrthodonticPatient?.id}
              >
                {orthodonticPatients.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} {p.phone_number ? `(${p.phone_number})` : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </S.FullWidth>
        )}

        {/* ── Patient Information ── */}
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: "First name is required." }]}
        >
          <Input
            placeholder="Enter first name"
            maxLength={80}
            disabled={isOrthoSelected}
          />
        </Form.Item>
        <Form.Item
          name="middleName"
          label="Middle Name"
          rules={[{ required: false }]}
        >
          <Input placeholder="(Optional)" maxLength={80} disabled={isOrthoSelected} />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: "Last name is required." }]}
        >
          <Input
            placeholder="Enter last name"
            maxLength={80}
            disabled={isOrthoSelected}
          />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Contact Number"
          rules={[{ validator: validatePhone }]}
        >
          <Input
            placeholder="0912 345 6789"
            maxLength={16}
            onChange={handlePhoneChange}
            disabled={isOrthoSelected}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ validator: validateEmail }]}
        >
          <Input
            placeholder="Enter email (optional)"
            maxLength={256}
            disabled={isOrthoSelected}
          />
        </Form.Item>
        <Form.Item
          name="birthDate"
          label="Birthdate"
          rules={[{ validator: validateBirthDate }]}  // ✅ optional
        >
          <DatePicker
            style={{ width: "100%" }}
            format="MMM D, YYYY"
            placeholder="Select birthdate (optional)"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
            disabled={isOrthoSelected}
          />
        </Form.Item>
        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender." }]}
        >
          <Select placeholder="Select gender" disabled={isOrthoSelected}>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
            <Option value="prefer-not-to-say">Prefer not to say</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          label="Complete Address"
          rules={[{ required: false }]}  // ✅ optional
        >
          <Input
            placeholder="Enter complete address (optional)"
            disabled={isOrthoSelected}
          />
        </Form.Item>

        {/* ── Appointment Information ── */}
        <Form.Item
          name="branchId"
          label="Branch"
          rules={[{ required: true, message: "Please select a branch." }]}
        >
          <Select
            placeholder="Select branch"
            loading={branchesLoading}
          >
            {branches.map((b) => (
              <Option key={b.id} value={b.id}>{b.name}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="serviceBranchId"
          label="Service"
          rules={[{ required: true, message: "Please select a service." }]}
        >
          <Select
            placeholder={selectedBranch ? "Select service" : "Select a branch first"}
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

        <Form.Item
          name="date"
          label="Preferred Date"
          rules={[{ required: true, message: "Please pick a date." }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="MMM D, YYYY"
            placeholder="Select date"
            disabledDate={disabledDate}
            disabled={!selectedBranch}
          />
        </Form.Item>

        {selectedDate && isDateFullyBooked && (
          <S.WarningText>This date is fully booked. Please select another date.</S.WarningText>
        )}

        <Form.Item
          name="time"
          label="Preferred Time"
          extra={selectedDate && dayjs(selectedDate).day() === 5 ? "Friday hours: 10:30 AM – 4:00 PM" : "Clinic hours: 10:30 AM – 5:00 PM"}
          rules={[{ required: true, message: "Please pick a time." }]}
        >
          <TimePicker
            key={`time-${selectedBranch}-${selectedDate?.format('YYYY-MM-DD')}`}
            style={{ width: "100%" }}
            format="h:mm A"
            use12Hours
            placeholder="Select time"
            disabledTime={disabledTime}
            hideDisabledOptions={true}
            disabled={!selectedBranch || !selectedDate}
            popupStyle={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            popupClassName="time-picker-no-scrollbar"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes / Remarks"
          rules={[{ required: false }]}
        >
          <Input.TextArea placeholder="Additional notes (optional)" rows={3} />
        </Form.Item>

        {showStatus && (
          <S.FullWidth>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status." }]}
            >
              <Select placeholder="Select status">
                {STATUS_OPTIONS_FORM.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
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