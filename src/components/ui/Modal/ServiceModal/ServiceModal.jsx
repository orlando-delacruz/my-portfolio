// src/components/ui/Modal/ServiceModal.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import * as S from "./ServiceModal.styled";

const ServiceModal = memo(({ service, open, onClose }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const { title, titleTl, fullDesc, image, imageAlt, starting_price, maximum_price } = service;

  const getPriceDisplay = () => {
    if (!starting_price && !maximum_price) return null;
    if (starting_price === maximum_price) {
      return `₱${Number(starting_price).toLocaleString()}`;
    }
    return `₱${Number(starting_price).toLocaleString()} – ₱${Number(maximum_price).toLocaleString()}`;
  };

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
        {getPriceDisplay() && (
          <S.ModalPrice>{getPriceDisplay()}</S.ModalPrice>
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