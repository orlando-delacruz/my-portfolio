// src/components/admin/AdminLayout/AdminLayout.jsx
import { memo, useState, useCallback } from "react";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import Footer from "../Footer";
import useAdminStore from "../../../store/useAdminStore";
import { useAuthStore } from "../../../store/authStore";
import * as S from "./AdminLayout.styled";

const AdminLayout = ({ children }) => {
  const { sidebarCollapsed } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Get authenticated admin profile from auth store ──
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);

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
    </S.LayoutRoot>
  );
};

export default memo(AdminLayout);