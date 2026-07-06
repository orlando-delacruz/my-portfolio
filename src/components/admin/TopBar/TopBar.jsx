// src/components/admin/TopBar/TopBar.jsx
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdMenu, MdNotifications } from "react-icons/md";
import { Dropdown, Avatar, Spin } from "antd";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import { supabase } from "../../../services/supabase/supabase";
import { useAuthStore } from "../../../store/authStore";
import useAdminStore from "../../../store/useAdminStore";
import * as S from "./TopBar.styled";

const TopBar = memo(({ user, loading, onMenuClick }) => {
  const navigate = useNavigate();
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar);
  const clearAuth = useAuthStore((s) => s.clear);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuth]);

  const menuItems = [
    {
      key: "profile",
      icon: <SettingOutlined />,
      label: "My Profile",
      onClick: () => navigate("/admin/settings"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return parts[0][0] || "U";
  };

  const initials = getInitials(user.name);

  return (
    <S.Bar role="banner">
      <S.LeftGroup>
        <S.DesktopHamburgerBtn onClick={toggleSidebar} aria-label="Toggle sidebar">
          <MdMenu aria-hidden="true" />
        </S.DesktopHamburgerBtn>
        <S.MobileHamburgerBtn onClick={onMenuClick} aria-label="Open navigation menu">
          <MdMenu aria-hidden="true" />
        </S.MobileHamburgerBtn>
      </S.LeftGroup>

      <S.RightGroup>
        <S.NotifButton aria-label="View notifications">
          <MdNotifications aria-hidden="true" />
          <S.NotifBadge aria-hidden="true" />
        </S.NotifButton>

        <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight" arrow>
          <S.UserBlock>
            {loading ? (
              <Spin size="small" />
            ) : (
              <>
                {user.avatarUrl ? (
                  <Avatar src={user.avatarUrl} alt={user.name || "Admin"} size={38} />
                ) : (
                  <S.AvatarWrapper>{initials}</S.AvatarWrapper>
                )}
                <S.UserInfo>
                  <S.UserName>{user.name || "Admin"}</S.UserName>
                  <S.UserRole>{user.role || "Staff"}</S.UserRole>
                </S.UserInfo>
              </>
            )}
          </S.UserBlock>
        </Dropdown>
      </S.RightGroup>
    </S.Bar>
  );
});

TopBar.displayName = "TopBar";
export default TopBar;