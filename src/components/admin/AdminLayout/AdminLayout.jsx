// src/components/admin/AdminLayout/AdminLayout.jsx
import { memo, useState, useCallback } from "react";
import SideBar from "../SideBar";
import TopBar from "../TopBar";
import Footer from "../Footer";
import useAdminStore from "../../../store/useAdminStore";
import * as S from "./AdminLayout.styled";

/**
 *
 * @param {ReactNode} children
 * @param {object}    user  — { name, role, avatarUrl }
 */
const AdminLayout = ({ children, user }) => {
  const { sidebarCollapsed } = useAdminStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleOverlayClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <S.LayoutRoot $collapsed={sidebarCollapsed}>
      {/* ── Sidebar slot — the 10px padding lives here ── */}
      <S.SidebarSlot
        $collapsed={sidebarCollapsed}
        $mobileOpen={mobileOpen}
        aria-label="Admin sidebar"
      >
        <SideBar />
      </S.SidebarSlot>

      {/* ── Mobile overlay ── */}
      <S.Overlay
        $visible={mobileOpen}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* ── Main column ── */}
      <S.MainColumn>
        <S.TopBarSlot>
          <TopBar
            user={user}
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