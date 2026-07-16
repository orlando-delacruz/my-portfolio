// src/components/ui/Modal/ServiceModal.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import * as S from "./ServiceModal.styled";

const formatPrice = (starting, maximum) => {
  const start = Number(starting) || 0;
  const max = Number(maximum) || 0;
  if (start === max) {
    return `₱${start.toLocaleString()}`;
  }
  return `₱${start.toLocaleString()} – ₱${max.toLocaleString()}`;
};

const ServiceModal = memo(({ service, open, onClose }) => {
  const navigate = useNavigate();
  if (!service) return null;

  const {
    title = "",
    titleTl = "",
    fullDesc = "",
    image,
    imageAlt = title,
    starting_price = 0,
    maximum_price = 0,
  } = service;

  const priceDisplay = formatPrice(starting_price, maximum_price);
  const hasPrice = starting_price > 0 || maximum_price > 0;

  const handleBookNow = () => {
    navigate("/book");
    onClose();
  };

  // Use a placeholder image if no image is provided
  const imageSrc = image && image.startsWith("http")
    ? image
    : "https://picsum.photos/seed/dental/600/300";

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
        src={imageSrc}
        alt={imageAlt || title}
        loading="lazy"
        decoding="async"
        width={600}
        height={280}
        onError={(e) => {
          e.currentTarget.src = "https://picsum.photos/seed/dental/600/300";
        }}
      />
      <S.ModalBody>
        <S.ModalTitleGroup>
          <S.ModalTitle id="service-modal-title">{title}</S.ModalTitle>
          {titleTl && <S.ModalTitleTl>{titleTl}</S.ModalTitleTl>}
        </S.ModalTitleGroup>
        {hasPrice && <S.ModalPrice>{priceDisplay}</S.ModalPrice>}
        <S.ModalDesc>{fullDesc || "Description coming soon."}</S.ModalDesc>
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