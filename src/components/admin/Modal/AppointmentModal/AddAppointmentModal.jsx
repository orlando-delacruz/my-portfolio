// src/components/admin/Modal/AppointmentModal/AddAppointmentModal.jsx
import { memo, useEffect, useState } from "react";
import { Modal, Form } from "antd";
import AppointmentForm from "./AppointmentForm";
import { getOrthodonticPatients } from "../../../../services/patients";
import * as S from "./AppointmentModal.styled";

const AddAppointmentModal = memo(({ open, loading, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  // ── Orthodontic patients state ──
  const [patientType, setPatientType] = useState('new');
  const [selectedOrthodonticPatient, setSelectedOrthodonticPatient] = useState(null);
  const [orthodonticPatients, setOrthodonticPatients] = useState([]);
  const [loadingOrtho, setLoadingOrtho] = useState(false);

  // Fetch orthodontic patients when modal opens and ortho tab is selected
  useEffect(() => {
    if (open && patientType === 'ortho') {
      setLoadingOrtho(true);
      getOrthodonticPatients()
        .then(data => setOrthodonticPatients(data))
        .catch(err => console.error('Failed to load ortho patients:', err))
        .finally(() => setLoadingOrtho(false));
    }
  }, [open, patientType]);

  // Reset form and state when modal closes
  useEffect(() => {
    if (!open) {
      form.resetFields();
      setPatientType('new');
      setSelectedOrthodonticPatient(null);
    }
  }, [open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // If ortho patient selected, include the patient object
      if (patientType === 'ortho' && selectedOrthodonticPatient) {
        await onSubmit({ ...values, patientType, selectedOrthodonticPatient }, form);
      } else {
        await onSubmit({ ...values, patientType }, form);
      }
    } catch {
      // Ant Design handles field-level errors
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setPatientType('new');
    setSelectedOrthodonticPatient(null);
    onClose();
  };

  const handlePatientTypeChange = (type) => {
    setPatientType(type);
    setSelectedOrthodonticPatient(null);
    form.resetFields();
  };

  const handleOrthoPatientSelect = (patient) => {
    setSelectedOrthodonticPatient(patient);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={<S.ModalTitle>Add Appointment</S.ModalTitle>}
      width={720}
      centered
      destroyOnHidden
      aria-label="Add new appointment"
    >
      <AppointmentForm
        form={form}
        showStatus={false}
        showPatientSelector={true}
        patientType={patientType}
        selectedOrthodonticPatient={selectedOrthodonticPatient}
        orthodonticPatients={orthodonticPatients}
        onPatientTypeChange={handlePatientTypeChange}
        onOrthodonticPatientSelect={handleOrthoPatientSelect}
        loadingOrthoPatients={loadingOrtho}
      />
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