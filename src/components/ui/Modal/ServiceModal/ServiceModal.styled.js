// src/components/ui/Modal/ServiceModal.styled.js
import styled from "styled-components";
import { FiX } from "react-icons/fi";
import theme from "../../../../styles/theme";

export const CloseIcon = styled(FiX)`
  font-size: 20px;
  color: ${theme.colors.black};
`;

export const ModalImage = styled.img`
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
  border-radius: 20px 20px 0 0;
`;

export const ModalBody = styled.div`
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const ModalTitle = styled.h2`
  font-size: ${theme.typography.heading.h3};
  font-weight: ${theme.typography.weight.semibold};
  color: ${theme.colors.black};
  line-height: 1.3;
  margin: 0;
`;

export const ModalTitleTl = styled.span`
  font-size: ${theme.typography.size.sm};
  font-weight: ${theme.typography.weight.regular};
  color: ${theme.colors.primary};
  font-style: italic;
  line-height: 1.4;
`;

export const ModalPrice = styled.p`
  display: inline-flex;
  align-self: flex-start;
  background: ${theme.colors.secondary};
  color: ${theme.colors.primaryDark};
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.semibold};
  padding: 5px 16px;
  border-radius: 50px;
  margin: 0;
  line-height: 1.5;
`;

export const ModalDesc = styled.p`
  font-size: ${theme.typography.size.body};
  color: ${theme.colors.black};
  line-height: 1.75;
  opacity: 0.85;
  margin: 0;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;

  @media (max-width: 480px) {
    justify-content: stretch;
    button {
      width: 100%;
    }
  }
`;