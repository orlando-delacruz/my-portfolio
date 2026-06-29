// src/components/ui/Modal/ServiceModal.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import * as S from "./ServiceModal.styled";

const ServiceModal = memo(({ service, open, onClose }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const { title, titleTl, fullDesc, image, imageAlt, price } = service;

  const handleBookThisService = () => {
    navigate("/book");
    onClose();
  };

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
        <S.ModalTitleGroup>
          <S.ModalTitle id="service-modal-title">{title}</S.ModalTitle>
          {titleTl && <S.ModalTitleTl>{titleTl}</S.ModalTitleTl>}
        </S.ModalTitleGroup>
        {price && (
          <S.ModalPrice>
            Starts at ₱{price.toLocaleString("en-PH")}
          </S.ModalPrice>
        )}
        <S.ModalDesc>{fullDesc}</S.ModalDesc>
        <S.ModalFooter>
          <S.BookButton
            onClick={handleBookThisService}
            aria-label={`Book an appointment for ${title}`}
          >
            Book This Service
          </S.BookButton>
        </S.ModalFooter>
      </S.ModalBody>
    </Modal>
  );
});

ServiceModal.displayName = "ServiceModal";
export default ServiceModal;