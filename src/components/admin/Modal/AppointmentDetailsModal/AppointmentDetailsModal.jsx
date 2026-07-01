// src/components/admin/Modal/AppointmentDetailsModal/AppointmentDetailsModal.jsx
import { memo } from "react";
import { Modal, Divider, Dropdown } from "antd";
import { STATUS_CONFIG } from "../../../../data/admin/appointment";
import * as S from "./AppointmentDetailsModal.styled";

const StatusBadge = memo(({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: "#686868",
    bg: "rgba(104,104,104,0.2)",
  };
  return (
    <S.StatusBadge $color={cfg.color} $bg={cfg.bg}>
      <S.StatusDot $color={cfg.color} aria-hidden="true" />
      <span>{cfg.label}</span>
    </S.StatusBadge>
  );
});
StatusBadge.displayName = "StatusBadge";

const AppointmentDetailsModal = memo(({
  open,
  appointment,
  onClose,
  onSetStatus,
  onReschedule,
}) => {
  if (!appointment) return null;

  const statusItems = [
    { key: "completed", label: "Completed" },
    { key: "confirmed", label: "Confirmed" },
    { key: "pending", label: "Pending" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const statusMenuProps = {
    items: statusItems.map((s) => ({
      key: s.key,
      label: s.label,
      onClick: () => {
        onSetStatus(appointment.id, s.key);
        // Optionally close modal after status update? No, let the parent handle.
      },
    })),
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<S.ModalTitle>Appointment Details</S.ModalTitle>}
      width={600}
      centered
      destroyOnHidden
      aria-label="Appointment details"
    >
      <S.Content>
        <S.InfoGrid>
          <S.InfoItem>
            <S.InfoLabel>Reference No</S.InfoLabel>
            <S.InfoValue>{appointment.referenceNo}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Patient Name</S.InfoLabel>
            <S.InfoValue>{appointment.patientName}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Contact Number</S.InfoLabel>
            <S.InfoValue>{appointment.contactNumber}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Branch</S.InfoLabel>
            <S.InfoValue>{appointment.branchName}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Service</S.InfoLabel>
            <S.InfoValue>{appointment.reason}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Date</S.InfoLabel>
            <S.InfoValue>{appointment.date}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Time</S.InfoLabel>
            <S.InfoValue>{appointment.time}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>Status</S.InfoLabel>
            <StatusBadge status={appointment.status} />
          </S.InfoItem>
          {appointment.createdAt && (
            <S.InfoItem>
              <S.InfoLabel>Created At</S.InfoLabel>
              <S.InfoValue>
                {new Date(appointment.createdAt).toLocaleString()}
              </S.InfoValue>
            </S.InfoItem>
          )}
          {appointment.updatedAt && (
            <S.InfoItem>
              <S.InfoLabel>Updated At</S.InfoLabel>
              <S.InfoValue>
                {new Date(appointment.updatedAt).toLocaleString()}
              </S.InfoValue>
            </S.InfoItem>
          )}
        </S.InfoGrid>
      </S.Content>

      <Divider />

      <S.Footer>
        <Dropdown menu={statusMenuProps} trigger={["click"]}>
          <S.ActionBtn $variant="primary">Set Status</S.ActionBtn>
        </Dropdown>
        <S.ActionBtn
          $variant="secondary"
          onClick={() => {
            onReschedule(appointment.id);
          }}
        >
          Reschedule
        </S.ActionBtn>
      </S.Footer>
    </Modal>
  );
});

AppointmentDetailsModal.displayName = "AppointmentDetailsModal";
export default AppointmentDetailsModal;