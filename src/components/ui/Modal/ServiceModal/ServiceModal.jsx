// src/components/ui/Modal/ServiceModal.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import * as S from "./ServiceModal.styled";

const formatPrice = (starting, maximum) => {
  if (starting === undefined || starting === null) return null;
  const start = Number(starting);
  const max = Number(maximum);
  if (start === max) return `₱${start.toLocaleString()}`;
  return `₱${start.toLocaleString()} – ₱${max.toLocaleString()}`;
};

const ServiceModal = memo(({ service, open, onClose }) => {
  const navigate = useNavigate();
  if (!service) return null;

  const {
    title,
    titleTl,
    fullDesc,
    image,
    imageAlt,
    starting_price,
    maximum_price,
  } = service;

  const priceDisplay = formatPrice(starting_price, maximum_price);

  const handleBookNow = () => {
    // Static navigation to the booking page – no query parameters or state.
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
        alt={imageAlt || title}
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
        {priceDisplay && <S.ModalPrice>{priceDisplay}</S.ModalPrice>}
        <S.ModalDesc>{fullDesc}</S.ModalDesc>
        <S.ModalFooter>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={handleBookNow}
            style={{
              borderRadius: "50px",
              height: "44px",
              padding: "0 28px",
              background: "#886217",
              borderColor: "#886217",
            }}
          >
            Book This Service
          </Button>
        </S.ModalFooter>
      </S.ModalBody>
    </Modal>
  );
});

ServiceModal.displayName = "ServiceModal";
export default ServiceModal;