// src/components/admin/Modal/AppointmentModal/RescheduleModal.jsx
import { memo, useState, useEffect } from "react";
import { Modal, Form, Spin, Alert } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppointmentForm from "./AppointmentForm";
import { getAppointmentById } from "../../../../services/appointments";
import * as S from "./AppointmentModal.styled";

// Helper: normalize time string to "HH:mm:ss"
const normalizeTime = (time) => {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length === 2) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:00`;
  }
  if (parts.length === 3) {
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}:${parts[2].padStart(2, '0')}`;
  }
  return time;
};

const RescheduleModal = memo(({ open, appointmentId, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && appointmentId) {
      setFetchLoading(true);
      setError(null);
      getAppointmentById(appointmentId)
        .then((data) => {
          setAppointment(data);
        })
        .catch((err) => {
          console.error('Failed to fetch appointment for reschedule:', err);
          setError('Could not load appointment data. Please try again.');
        })
        .finally(() => setFetchLoading(false));
    }
  }, [open, appointmentId]);

  useEffect(() => {
    if (open && appointment) {
      const patient = appointment.patient || {};

      // Use confirmed date/time if available, otherwise fallback to preferred
      const appointmentDate = appointment.confirmed_date || appointment.preferred_date;
      const appointmentTime = appointment.confirmed_time || appointment.preferred_time;

      const normalizedTime = normalizeTime(appointmentTime);
      const dateValue = appointmentDate ? dayjs(appointmentDate) : null;

      form.setFieldsValue({
        firstName: patient.first_name || "",
        middleName: patient.middle_name || "",
        lastName: patient.last_name || "",
        phoneNumber: patient.phone_number || "",
        email: patient.email || "",
        birthDate: patient.birth_date ? dayjs(patient.birth_date) : null,
        gender: patient.gender || "",
        address: patient.address || "",
        branchId: appointment.service_branch?.branch_id || null,
        serviceBranchId: appointment.service_branch_id || null,
        status: appointment.approval_status === 'approved' && appointment.appointment_status === 'scheduled' ? 'confirmed' :
          appointment.appointment_status === 'cancelled' ? 'cancelled' :
            appointment.appointment_status === 'completed' ? 'completed' : 'pending',
        date: dateValue,
        time: normalizedTime, // Now in "HH:mm:ss"
        notes: appointment.chief_complaint || appointment.admin_notes || "",
      });
    }
  }, [open, appointment, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, form);
    } catch {
      // Field-level errors handled by Ant Design
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  if (fetchLoading) {
    return (
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        title={<S.ModalTitle>Loading appointment...</S.ModalTitle>}
        width={720}
        centered
        destroyOnHidden
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        open={open}
        onCancel={handleCancel}
        footer={null}
        title={<S.ModalTitle>Error</S.ModalTitle>}
        width={720}
        centered
        destroyOnHidden
      >
        <div style={{ textAlign: 'center', padding: '20px', color: '#dc2626' }}>{error}</div>
      </Modal>
    );
  }

  if (!appointment) return null;

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={<S.ModalTitle>Reschedule — {appointment.reference_number}</S.ModalTitle>}
      width={720}
      centered
      destroyOnHidden
      aria-label="Reschedule appointment"
    >
      <AppointmentForm
        form={form}
        showStatus={true}
        excludeAppointmentId={appointmentId}
        patientReadOnly={true}
      />

      <Alert
        type="info"
        showIcon
        title="Patient information cannot be edited during rescheduling."
        description={
          <>
            To update patient details, go to the <strong>Patients</strong> page.
          </>
        }
        style={{ marginTop: 16, marginBottom: 8 }}
      />

      <S.FooterRow>
        <S.CancelBtn onClick={handleCancel} type="button" disabled={loading}>
          <CloseOutlined /> Cancel
        </S.CancelBtn>
        <S.SubmitBtn onClick={handleOk} disabled={loading} type="button">
          <SaveOutlined /> {loading ? "Saving…" : "Save Changes"}
        </S.SubmitBtn>
      </S.FooterRow>
    </Modal>
  );
});

RescheduleModal.displayName = "RescheduleModal";
export default RescheduleModal;