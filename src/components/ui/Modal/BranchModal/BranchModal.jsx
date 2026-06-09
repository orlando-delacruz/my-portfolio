import { memo } from "react";
import { Modal } from "antd";
import * as S from "./BranchModal.styled";

/**
 * BranchModal
 *
 * @param {object}   branch   - Branch data object (or null)
 * @param {boolean}  open     - Controls modal visibility
 * @param {function} onClose  - Callback to close the modal
 */
const BranchModal = memo(({ branch, open, onClose }) => {
  if (!branch) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`${branch.name} — ${branch.location}`}
      centered
      width={580}
      styles={{
        header: { borderBottom: "none", paddingBottom: 0 },
        body: { paddingTop: 16 },
      }}
    >
      <S.ModalMapFrame
        src={branch.mapSrc}
        title={`Map of ${branch.name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={`Google Maps showing ${branch.name} in ${branch.location}`}
      />

      <S.ModalSection>
        <S.ModalSectionLabel>Contact Info</S.ModalSectionLabel>
        {branch.contact.map(({ icon: Icon, label, value, href }) => (
          <S.ModalContactRow key={label}>
            <Icon aria-hidden="true" />
            <span>
              {href ? <a href={href}>{value}</a> : value}
            </span>
          </S.ModalContactRow>
        ))}
      </S.ModalSection>

      <S.ModalSection>
        <S.ModalSectionLabel>Available Services</S.ModalSectionLabel>
        <S.ModalServiceGrid
          role="list"
          aria-label={`Services at ${branch.name}`}
        >
          {branch.services.map((service) => (
            <S.ModalServiceItem key={service} role="listitem">
              {service}
            </S.ModalServiceItem>
          ))}
        </S.ModalServiceGrid>
      </S.ModalSection>
    </Modal>
  );
});

BranchModal.displayName = "BranchModal";
export default BranchModal;
