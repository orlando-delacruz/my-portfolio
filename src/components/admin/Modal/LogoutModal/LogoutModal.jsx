// src/components/admin/Modal/LogoutModal/LogoutModal.jsx
import { memo } from "react";
import { Modal, Spin } from "antd";
import { LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as S from "./LogoutModal.styled";

const LogoutModal = memo(({ open, onClose, onConfirm, loading, user }) => {
  const displayName = user?.full_name || "Admin User";
  const displayRole = user?.role || "Administrator";
  const avatarUrl = user?.avatar_url || null;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      closable={false}
      destroyOnHidden={true}                      // ✅ v6: destroyOnHidden
      mask={{ closable: true }}                  // ✅ v6: mask.closable
      styles={{
        content: {
          padding: 0,
          borderRadius: "16px",
          overflow: "hidden",
          background: "#ffffff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.20)",
        },
        mask: {
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <S.ModalContent>
        <S.Header>
          <S.IconWrapper>
            <LogoutOutlined />
          </S.IconWrapper>
          <S.Title>Log Out</S.Title>
        </S.Header>

        <S.Description>
          Are you sure you want to sign out of your administrator account?
        </S.Description>

        <S.WarningBox>
          <ExclamationCircleOutlined />
          <span>Any unsaved changes may be lost</span>
        </S.WarningBox>

        <S.UserInfo>
          <S.Avatar>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} />
            ) : (
              avatarInitial
            )}
          </S.Avatar>
          <S.UserDetails>
            <S.UserName>{displayName}</S.UserName>
            <S.UserRole>{displayRole}</S.UserRole>
          </S.UserDetails>
        </S.UserInfo>

        <S.Actions>
          <S.CancelButton onClick={onClose} disabled={loading}>
            Cancel
          </S.CancelButton>
          <S.LogoutButton onClick={onConfirm} disabled={loading}>
            {loading ? <Spin size="small" /> : "Log Out"}
          </S.LogoutButton>
        </S.Actions>
      </S.ModalContent>
    </Modal>
  );
});

LogoutModal.displayName = "LogoutModal";
export default LogoutModal;