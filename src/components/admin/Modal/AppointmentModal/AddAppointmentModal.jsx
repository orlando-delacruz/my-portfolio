// src/components/admin/Modal/AppointmentModal/AddAppointmentModal.jsx
import { memo } from "react";
import { Modal, Form } from "antd";
import AppointmentForm from "./AppointmentForm";
import * as S from "./AppointmentModal.styled";

/**
 * AddAppointmentModal
 *
 * @param {boolean}  open      - Controls visibility
 * @param {boolean}  loading   - Submit in progress
 * @param {function} onClose   - Close handler
 * @param {function} onSubmit  - (values, form) => void
 */
const AddAppointmentModal = memo(({ open, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values, form);
    } catch {
      // Ant Design handles field-level error display; no extra action needed
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
      title={<S.ModalTitle>Add Appointment</S.ModalTitle>}
      width={680}
      centered
      destroyOnClose
      aria-label="Add new appointment"
    >
      <AppointmentForm form={form} showStatus={false} />

      <S.FooterRow>
        <S.CancelBtn onClick={handleCancel} type="button">
          Cancel
        </S.CancelBtn>
        <S.SubmitBtn onClick={handleOk} disabled={loading} type="button">
          {loading ? "Adding…" : "Add Appointment"}
        </S.SubmitBtn>
      </S.FooterRow>
    </Modal>
  );
});

AddAppointmentModal.displayName = "AddAppointmentModal";
export default AddAppointmentModal;