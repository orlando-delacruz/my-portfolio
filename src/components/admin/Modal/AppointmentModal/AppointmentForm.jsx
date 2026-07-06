// src/components/admin/Modal/AppointmentModal/AppointmentForm.jsx
import { memo, useEffect, useCallback, useRef, useMemo } from "react";
import { Form, Input, Select, DatePicker, TimePicker, Switch, Radio } from "antd";
import dayjs from "dayjs";
import { MdEventBusy, MdOutlineEventBusy } from "react-icons/md";
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

  // Stabilize date keys (strings) to avoid re-renders
  const selectedDateRaw = Form.useWatch("date", form);
  const selectedDateKey = useMemo(() => {
    return selectedDateRaw ? dayjs(selectedDateRaw).format("YYYY-MM-DD") : null;
  }, [selectedDateRaw]);

  const monthKey = useMemo(() => {
    return selectedDateKey ? selectedDateKey.slice(0, 7) : null;
  }, [selectedDateKey]);

  const selectedDate = useMemo(() => {
    return selectedDateKey ? dayjs(selectedDateKey) : null;
  }, [selectedDateKey]);

  const {
    disabledTime,
    isDateFullyBooked,
    isSelectedDateClosed,
  } = useAppointmentAvailability(
    selectedBranch,
    selectedDateKey,
    monthKey
  );

  const { serviceBranches, loading: servicesLoading } = useServiceBranches(selectedBranch);

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

  // Only disable past dates
  const disabledDate = useCallback(
    (current) => {
      if (!selectedBranch) return true;
      if (!current) return false;
      return current.startOf("day").isBefore(dayjs().startOf("day"));
    },
    [selectedBranch]
  );

  // ── Patient type change handler ──
  const handlePatientTypeChange = (e) => {
    const value = e.target.value;
    onPatientTypeChange?.(value);
    form.setFieldsValue({
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      birthDate: null,
      gender: '',
      address: '',
      isOrthodontic: false,
      branchId: undefined,
    });
    onOrthodonticPatientSelect?.(null);
    form.setFieldValue('serviceBranchId', undefined);
  };

  // ── Orthodontic patient selection ──
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
        branchId: patient.branch_id || undefined,
      });
      form.setFieldValue('serviceBranchId', undefined);
    }
  };

  const isOrthoSelected = patientType === 'ortho' && selectedOrthodonticPatient !== null;
  const isNewPatient = patientType === 'new';

  // Determine if the selected date is unavailable
  const isDateUnavailable = isSelectedDateClosed || isDateFullyBooked;

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <S.FormGrid>
        {/* ── Patient Type Tabs ── */}
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
          rules={[{ validator: validateBirthDate }]}
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
          rules={[{ required: false }]}
        >
          <Input
            placeholder="Enter complete address (optional)"
            disabled={isOrthoSelected}
          />
        </Form.Item>

        {/* ── Mark as Orthodontic (only for new patients) ── */}
        {showPatientSelector && isNewPatient && (
          <S.FullWidth>
            <Form.Item label="Mark as Orthodontic Patient" valuePropName="checked">
              <Switch name="isOrthodontic" />
            </Form.Item>
          </S.FullWidth>
        )}

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
            disabled={!selectedBranch || isDateUnavailable}
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

        {/* ── Clean Warning Cards ── */}
        {selectedDate && isSelectedDateClosed && (
          <S.WarningCard>
            <S.CardIcon>
              <MdEventBusy size={20} />
            </S.CardIcon>
            <S.CardContent>
              <S.CardTitle>Selected date is closed.</S.CardTitle>
              <S.CardDescription>
                The clinic is not accepting appointments on this day. Please choose another date.
              </S.CardDescription>
            </S.CardContent>
          </S.WarningCard>
        )}

        {selectedDate && isDateFullyBooked && !isSelectedDateClosed && (
          <S.WarningCard>
            <S.CardIcon>
              <MdOutlineEventBusy size={20} />
            </S.CardIcon>
            <S.CardContent>
              <S.CardTitle>Selected date is fully booked.</S.CardTitle>
              <S.CardDescription>
                There are no remaining appointment slots for this date. Please choose another date.
              </S.CardDescription>
            </S.CardContent>
          </S.WarningCard>
        )}

        {/* ── TimePicker: only shown when date is available ── */}
        {selectedDate && !isSelectedDateClosed && !isDateFullyBooked && (
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
        )}

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
export default memo(AppointmentForm);