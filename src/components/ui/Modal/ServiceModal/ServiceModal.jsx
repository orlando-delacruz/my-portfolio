// src/components/ui/Modal/ServiceModal.jsx
import { memo } from "react";
import { Modal } from "antd";
import * as S from "./ServiceModal.styled";

const ServiceModal = memo(({ service, open, onClose }) => {
  if (!service) return null;

  const { title, fullDesc, image, imageAlt } = service;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      styles={{
        content: { borderRadius: "20px", padding: 0, overflow: "hidden" },
        mask: { backdropFilter: "blur(3px)" },
      }}
      closeIcon={<S.CloseIcon aria-label="Close modal" />}
      aria-labelledby="service-modal-title"
    >
      <S.ModalImage
        src={image}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        width={600}
        height={280}
      />
      <S.ModalBody>
        <S.ModalTitle id="service-modal-title">{title}</S.ModalTitle>
        <S.ModalDesc>{fullDesc}</S.ModalDesc>
        <S.ModalFooter>
          <S.BookButton href="#contact" onClick={onClose} aria-label={`Book an appointment for ${title}`}>
            Book This Service
          </S.BookButton>
        </S.ModalFooter>
      </S.ModalBody>
    </Modal>
  );
});

ServiceModal.displayName = "ServiceModal";
export default ServiceModal;