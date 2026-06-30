import { memo, useEffect } from "react";
import { Form, Input, Select, DatePicker, TimePicker } from "antd";
import { STATUS_OPTIONS_FORM } from "./appointmentFormSchema";
import { useBranches } from "../../../../hooks/useBranches";
import { useServiceBranches } from "../../../../hooks/useServiceBranches";
import * as S from "./AppointmentModal.styled";

const { Option } = Select;

const AppointmentForm = memo(({ form, showStatus = false }) => {
  const { branches, loading: branchesLoading } = useBranches();
  console.log("branches:", branches, "branchesLoading:", branchesLoading);
  const selectedBranch = Form.useWatch("branch", form);
  const { serviceBranches, loading: servicesLoading } = useServiceBranches(selectedBranch);

  // Clear the reason whenever the branch changes — services differ per branch
  useEffect(() => {
    form.setFieldValue("reason", undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  return (
    <Form form={form} layout="vertical" requiredMark={false}>
      <S.FormGrid>
        <Form.Item
          name="patientName"
          label="Patient Name"
          rules={[
            { required: true, message: "Patient name is required." },
            { min: 2, message: "Name must be at least 2 characters." },
            { pattern: /^[a-zA-Z\s.'-]+$/, message: "Name contains invalid characters." },
          ]}
        >
          <Input placeholder="e.g. Juan Dela Cruz" maxLength={80} />
        </Form.Item>

        <Form.Item
          name="contactNumber"
          label="Contact Number"
          rules={[
            { required: true, message: "Contact number is required." },
            { pattern: /^(\+63|0)\d{10}$/, message: "Enter a valid PH number (e.g. +639123456789 or 09123456789)." },
          ]}
        >
          <Input placeholder="+63 912 345 6789" maxLength={15} />
        </Form.Item>

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

        <Form.Item name="date" label="Preferred Date" rules={[{ required: true, message: "Please pick a date." }]}>
          <DatePicker style={{ width: "100%" }} format="MMM D, YYYY" placeholder="Select date" />
        </Form.Item>

        <Form.Item name="time" label="Preferred Time" rules={[{ required: true, message: "Please pick a time." }]}>
          <TimePicker style={{ width: "100%" }} format="h:mm A" use12Hours placeholder="Select time" />
        </Form.Item>

        {showStatus && (
          <S.FullWidth>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select a status." }]}>
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