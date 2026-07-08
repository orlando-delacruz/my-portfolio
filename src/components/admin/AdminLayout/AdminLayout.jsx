// src/components/admin/AdminLayout/AdminLayout.jsx
import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../services/supabase/supabase";
import { useAuthStore } from "../../../store/authStore";
import { useLogoutStore } from "../../../store/useLogoutStore";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import Footer from "../Footer";
import LogoutModal from "../Modal/LogoutModal";
import useAdminStore from "../../../store/useAdminStore";
import * as S from "./AdminLayout.styled";

const AdminLayout = ({ children }) => {
  const { sidebarCollapsed } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const clearAuth = useAuthStore((state) => state.clear);

  const { isOpen, closeLogoutModal } = useLogoutStore();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      clearAuth();
      setIsLoggingOut(false);
      closeLogoutModal();
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuth, closeLogoutModal]);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleOverlayClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const user = {
    name: profile?.full_name || "",
    role: profile?.role || "",
    avatarUrl: profile?.avatar_url || null,
  };

  return (
    <S.LayoutRoot $collapsed={sidebarCollapsed}>
      <S.SidebarSlot
        $collapsed={sidebarCollapsed}
        $mobileOpen={mobileOpen}
        aria-label="Admin sidebar"
      >
        <SideBar />
      </S.SidebarSlot>

      <S.Overlay
        $visible={mobileOpen}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      <S.MainColumn>
        <S.TopBarSlot>
          <TopBar
            user={user}
            loading={loading}
            onMenuClick={handleMobileToggle}
            mobileOpen={mobileOpen}
          />
        </S.TopBarSlot>

        <S.ContentSlot id="admin-main-content">
          {children}
        </S.ContentSlot>

        <S.FooterSlot>
          <Footer />
        </S.FooterSlot>
      </S.MainColumn>

      <LogoutModal
        open={isOpen}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
        loading={isLoggingOut}
        user={profile}
      />
    </S.LayoutRoot>
  );
};

export default memo(AdminLayout);