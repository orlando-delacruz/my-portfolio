// src/components/admin/Modal/AppointmentModal/RescheduleModal.jsx
import { memo, useEffect } from "react";
import { Modal, Form } from "antd";
import dayjs from "dayjs";
import AppointmentForm from "./AppointmentForm";
import * as S from "./AppointmentModal.styled";

const RescheduleModal = memo(({ open, loading, appointment, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && appointment) {
      form.setFieldsValue({
        patientName: appointment.patientName,
        contactNumber: appointment.contactNumber,
        branch: appointment.branch,           // UUID — matches Branch dropdown
        reason: appointment.serviceBranchId,  // UUID — matches Reason dropdown
        status: appointment.status,
        date: appointment.date ? dayjs(appointment.date, "MMM D, YYYY") : null,
        time: appointment.time ? dayjs(appointment.time, "h:mm A") : null,
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

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={
        <S.ModalTitle>
          Reschedule — {appointment?.referenceNo ?? ""}
        </S.ModalTitle>
      }
      width={680}
      centered
      destroyOnHidden
      aria-label="Reschedule appointment"
    >
      <AppointmentForm form={form} showStatus={true} />

      <S.FooterRow>
        <S.CancelBtn onClick={handleCancel} type="button">
          Cancel
        </S.CancelBtn>
        <S.SubmitBtn onClick={handleOk} disabled={loading} type="button">
          {loading ? "Saving…" : "Save Changes"}
        </S.SubmitBtn>
      </S.FooterRow>
    </Modal>
  );
});

RescheduleModal.displayName = "RescheduleModal";
export default RescheduleModal;