// src/components/admin/Modal/AppointmentModal/RescheduleModal.jsx
import { memo, useState, useEffect } from "react";
import { Modal, Form, Spin } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AppointmentForm from "./AppointmentForm";
import { getAppointmentById } from "../../../../services/appointments";
import * as S from "./AppointmentModal.styled";

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
        date: appointment.preferred_date ? dayjs(appointment.preferred_date) : null,
        time: appointment.preferred_time ? dayjs(appointment.preferred_time, "HH:mm:ss") : null,
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
      <AppointmentForm form={form} showStatus={true} />
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