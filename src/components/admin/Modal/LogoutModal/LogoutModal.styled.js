// src/components/admin/Modal/LogoutModal/LogoutModal.styled.js
import styled, { keyframes } from "styled-components";
import adminTheme from "../../../../styles/adminTheme";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const ModalContent = styled.div`
  background: ${adminTheme.colors.white};
  border-radius: 16px;
  animation: ${fadeIn} 0.25s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @media (max-width: 576px) {
    gap: 18px;
    border-radius: 12px;
  }

  .ant-modal-body {
    padding: 0px !important;
  }
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const IconWrapper = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${adminTheme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${adminTheme.colors.white};
  font-size: 32px;
  flex-shrink: 0;

  @media (max-width: 576px) {
    width: 60px;
    height: 60px;
    font-size: 26px;
  }
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

export const Description = styled.p`
  font-size: 16px;
  font-weight: 400;
  color: ${adminTheme.colors.black};
  text-align: center;
  line-height: 1.5;
  margin: 0;
  max-width: 380px;
`;

export const WarningBox = styled.div`
  width: 100%;
  padding: 10px 16px;
  background: rgba(248, 19, 19, 0.10);
  border-radius: 10px;
  border: 1px solid rgba(248, 19, 19, 0.35);
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f81313;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;

  .anticon {
    font-size: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 576px) {
    font-size: 13px;
    padding: 8px 12px;
  }
`;

export const UserInfo = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid rgba(136, 98, 23, 0.25);
  display: flex;
  align-items: center;
  gap: 14px;
  background: ${adminTheme.colors.white};

  @media (max-width: 576px) {
    padding: 10px 12px;
    gap: 10px;
  }
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${adminTheme.colors.primary};
  color: ${adminTheme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  @media (max-width: 576px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const UserName = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${adminTheme.colors.black};
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UserRole = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.50);
  line-height: 1.4;
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

const BaseButton = styled.button`
  width: 100%;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  &:focus-visible {
    outline: 2px solid ${adminTheme.colors.primary};
    outline-offset: 2px;
  }
`;

export const CancelButton = styled(BaseButton)`
  background: ${adminTheme.colors.white};
  border: 1.5px solid ${adminTheme.colors.primary};
  color: ${adminTheme.colors.black};

  &:hover:not(:disabled) {
    background: ${adminTheme.colors.ivory};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const LogoutButton = styled(BaseButton)`
  background: ${adminTheme.colors.primary};
  border: 1.5px solid ${adminTheme.colors.primary};
  color: ${adminTheme.colors.white};

  &:hover:not(:disabled) {
    background: ${adminTheme.colors.primaryDark};
    border-color: ${adminTheme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  .ant-spin {
    color: ${adminTheme.colors.white};
  }
`;