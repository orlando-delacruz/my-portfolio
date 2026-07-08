// src/components/admin/Modal/AppointmentModal/AppointmentForm.jsx
import { memo, useEffect, useCallback, useRef, useMemo } from "react";
import { Form, Input, Select, DatePicker, Switch, Radio } from "antd";
import dayjs from "dayjs";
import { MdEventBusy } from "react-icons/md";
import { UserOutlined, CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import { STATUS_OPTIONS_FORM } from "./appointmentFormSchema";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import { useAppointmentAvailability } from "../../../../hooks/useAppointmentAvailability";
import { isValidPhilippinePhone } from "../../../../utils/phoneFormatter";
import PhoneInput from "../../../ui/PhoneInput/PhoneInput";
import * as S from "./AppointmentModal.styled";

const { Option } = Select;

// ── Validators ──
const validatePhone = (_, value) => {
  if (!value) return Promise.reject(new Error("Contact number is required."));
  if (!isValidPhilippinePhone(value)) {
    return Promise.reject(new Error("Enter a valid PH number (e.g., 0912 345 6789)."));
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

// ── Disable future dates for Birthdate ──
const disabledBirthDate = (current) => {
  return current && current > dayjs().endOf('day');
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
  excludeAppointmentId = null,
  patientReadOnly = false, // ✅ new prop
}) => {
  const { branches, loading: branchesLoading } = useBranches();
  const selectedBranch = Form.useWatch("branchId", form);
  const selectedDateRaw = Form.useWatch("date", form);
  const selectedDateKey = useMemo(() => selectedDateRaw ? dayjs(selectedDateRaw).format("YYYY-MM-DD") : null, [selectedDateRaw]);
  const monthKey = useMemo(() => selectedDateKey ? selectedDateKey.slice(0, 7) : null, [selectedDateKey]);
  const selectedDate = useMemo(() => selectedDateKey ? dayjs(selectedDateKey) : null, [selectedDateKey]);

  const { serviceBranches, loading: servicesLoading } = useServiceBranches(selectedBranch);

  const {
    allSlots,
    isDateFullyBooked,
    isSelectedDateClosed,
    closureVersion,
    schedulingVersion,
    loading: availabilityLoading,
  } = useAppointmentAvailability(selectedBranch, selectedDateKey, monthKey, excludeAppointmentId);

  const isDateUnavailable = isSelectedDateClosed || isDateFullyBooked;
  const showTimeSelection = selectedDateKey && !isDateUnavailable;

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
      if (current.startOf("day").isBefore(dayjs().startOf("day"))) return true;
      return false;
    },
    [selectedBranch]
  );

  // ── Patient type change ──
  const handlePatientTypeChange = (e) => {
    if (patientReadOnly) return; // ✅ prevent changes when read-only
    const value = e.target.value;
    onPatientTypeChange?.(value);
    form.setFieldsValue({
      firstName: '', middleName: '', lastName: '', phoneNumber: '', email: '',
      birthDate: null, gender: '', address: '', isOrthodontic: false, branchId: undefined,
    });
    onOrthodonticPatientSelect?.(null);
    form.setFieldValue('serviceBranchId', undefined);
  };

  const handleOrthoPatientSelect = (patientId) => {
    if (patientReadOnly) return; // ✅ prevent changes when read-only
    if (!patientId) { onOrthodonticPatientSelect?.(null); return; }
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

  // Format time for display
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return '';
    return dayjs(timeStr, 'HH:mm:ss').format('h:mm A');
  };

  const isTimeDisabled = !selectedBranch || !selectedDate || allSlots.length === 0 || isDateUnavailable;

  // ── Determine if patient fields should be disabled ──
  const isPatientDisabled = patientReadOnly || isOrthoSelected;

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ isOrthodontic: false, isWalkIn: false }}
    >
      <S.FormGrid>
        {/* ── Patient Type Tabs ── */}
        {showPatientSelector && (
          <S.FullWidth>
            <Form.Item label="Patient Type" required>
              <Radio.Group
                value={patientType}
                onChange={handlePatientTypeChange}
                buttonStyle="solid"
                disabled={patientReadOnly}
              >
                <Radio.Button value="new">New Patient</Radio.Button>
                <Radio.Button value="ortho">Orthodontic Patient</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </S.FullWidth>
        )}

        {showPatientSelector && patientType === 'ortho' && (
          <S.FullWidth>
            <Form.Item label="Select Orthodontic Patient" rules={[{ required: true, message: "Please select an orthodontic patient." }]}>
              <Select
                placeholder="Search orthodontic patients..."
                loading={loadingOrthoPatients}
                onChange={handleOrthoPatientSelect}
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                value={selectedOrthodonticPatient?.id}
                disabled={patientReadOnly}
              >
                {orthodonticPatients.map((p) => {
                  const displayName = `${p.first_name} ${p.last_name}${p.phone_number ? ` (${p.phone_number})` : ''}`.trim();
                  return (
                    <Option key={p.id} value={p.id} label={displayName}>
                      {displayName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </S.FullWidth>
        )}

        {/* ── Patient Information Section ── */}
        <S.SectionTitle><UserOutlined /> Patient Information</S.SectionTitle>

        <S.FieldRow>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "First name is required." }]}>
            <Input placeholder="Enter first name" maxLength={80} disabled={isPatientDisabled} />
          </Form.Item>
          <Form.Item name="middleName" label="Middle Name" rules={[{ required: false }]}>
            <Input placeholder="(Optional)" maxLength={80} disabled={isPatientDisabled} />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Last name is required." }]}>
            <Input placeholder="Enter last name" maxLength={80} disabled={isPatientDisabled} />
          </Form.Item>
        </S.FieldRow>

        <S.FieldRow>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select gender." }]}>
            <Select placeholder="Select gender" disabled={isPatientDisabled}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
              <Option value="prefer-not-to-say">Prefer not to say</Option>
            </Select>
          </Form.Item>
          <Form.Item name="birthDate" label="Birthdate" rules={[{ validator: validateBirthDate }]}>
            <DatePicker
              style={{ width: "100%" }}
              format="MMM D, YYYY"
              placeholder="Select birthdate (optional)"
              disabled={isPatientDisabled}
              disabledDate={disabledBirthDate}
            />
          </Form.Item>
        </S.FieldRow>

        <Form.Item name="phoneNumber" label="Contact Number" rules={[{ validator: validatePhone }]}>
          <PhoneInput placeholder="0912 345 6789" disabled={isPatientDisabled} />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ validator: validateEmail }]}>
          <Input placeholder="Enter email (optional)" maxLength={256} disabled={isPatientDisabled} />
        </Form.Item>

        <Form.Item name="address" label="Address" rules={[{ required: false }]}>
          <Input placeholder="Enter address (optional)" disabled={isPatientDisabled} />
        </Form.Item>

        {showPatientSelector && isNewPatient && !patientReadOnly && (
          <>
            <S.FullWidth>
              <Form.Item
                name="isOrthodontic"
                valuePropName="checked"
                label="Mark as Orthodontic Patient"
              >
                <Switch />
              </Form.Item>
            </S.FullWidth>
            <S.FullWidth>
              <Form.Item
                name="isWalkIn"
                valuePropName="checked"
                label="Is Walk-in?"
              >
                <Switch />
              </Form.Item>
            </S.FullWidth>
          </>
        )}

        {/* ── Appointment Information Section ── */}
        <S.SectionTitle><CalendarOutlined /> Appointment Information</S.SectionTitle>

        <Form.Item name="branchId" label="Branch" rules={[{ required: true, message: "Please select a branch." }]}>
          <Select placeholder="Select branch" loading={branchesLoading}>
            {branches.map((b) => <Option key={b.id} value={b.id}>{b.name}</Option>)}
          </Select>
        </Form.Item>

        <Form.Item name="serviceBranchId" label="Service" rules={[{ required: true, message: "Please select a service." }]}>
          <Select
            placeholder={selectedBranch ? "Select service" : "Select a branch first"}
            loading={servicesLoading}
            disabled={!selectedBranch || isDateUnavailable}
          >
            {serviceBranches.map((sb) => (
              <Option key={sb.service_branch_id} value={sb.service_branch_id}>{sb.name || "Unnamed"}</Option>
            ))}
          </Select>
        </Form.Item>

        <S.FieldRow>
          <Form.Item name="date" label="Appointment Date" rules={[{ required: true, message: "Please pick a date." }]}>
            <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" placeholder="Select date" disabledDate={disabledDate} disabled={!selectedBranch} key={`admin-datepicker-${selectedBranch}-${closureVersion}`} />
          </Form.Item>

          {selectedDate && isDateUnavailable ? (
            <S.WarningCard key={`admin-closure-${closureVersion}`}>
              <S.CardIcon><MdEventBusy size={20} /></S.CardIcon>
              <S.CardContent>
                <S.CardTitle>Selected Date is Closed</S.CardTitle>
                <S.CardDescription>The clinic is not accepting appointments on this day. Please choose another available date.</S.CardDescription>
              </S.CardContent>
            </S.WarningCard>
          ) : (
            showTimeSelection && (
              <Form.Item name="time" label="Appointment Time" rules={[{ required: true, message: "Please pick a time." }]}>
                <Select
                  placeholder={isTimeDisabled ? "No available slots" : "Select time"}
                  loading={servicesLoading || availabilityLoading}
                  disabled={isTimeDisabled}
                  key={`admin-timeselect-${selectedBranch}-${selectedDateKey}-${closureVersion}-${schedulingVersion}`}
                >
                  {allSlots.map((slot) => (
                    <Option key={slot.value} value={slot.value} disabled={slot.disabled}>
                      {formatTimeDisplay(slot.value)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )
          )}
        </S.FieldRow>

        {showStatus && (
          <S.FullWidth>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status." }]}>
              <Select placeholder="Select status">
                {STATUS_OPTIONS_FORM.map((o) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
              </Select>
            </Form.Item>
          </S.FullWidth>
        )}

        {/* ── Additional Information Section ── */}
        <S.SectionTitle><FileTextOutlined /> Additional Information</S.SectionTitle>

        <Form.Item name="notes" label="Notes / Remarks" rules={[{ required: false }]}>
          <Input.TextArea placeholder="Additional notes (optional)" rows={3} />
        </Form.Item>
      </S.FormGrid>
    </Form>
  );
});

export default memo(AppointmentForm);