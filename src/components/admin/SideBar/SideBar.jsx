// src/components/admin/SideBar/SideBar.jsx
import { memo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarNavItems, sidebarLogout } from "../../../data/admin/sidebar";
import { supabase } from "../../../services/supabase/supabase";
import { useAuthStore } from "../../../store/authStore";
import Logo from "../../../assets/images/logo-white.webp";
import * as S from "./SideBar.styled";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((state) => state.clear);

  const handleNav = useCallback((path) => navigate(path), [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      // Attempt to sign out from Supabase
      await supabase.auth.signOut();
    } catch (err) {
      // Log error but continue – even if signOut fails, we want to clear local state
      console.warn("Logout error (continuing):", err);
    } finally {
      // Clear the Zustand store
      clearAuth();
      // Navigate to login page
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuth]);

  return (
    <S.Nav role="navigation" aria-label="Admin navigation">
      <S.Brand>
        <S.BrandLogo src={Logo} alt="Leidi Bud Dentals" width={46} height={46} />
        <S.BrandName>LeidiBud Dentals</S.BrandName>
      </S.Brand>

      <S.NavList>
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/admin" && location.pathname.startsWith(item.path));

          return (
            <S.NavItem key={item.key}>
              <S.NavLinkBtn
                $active={isActive}
                onClick={() => handleNav(item.path)}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon aria-hidden="true" />
                {item.label}
              </S.NavLinkBtn>
            </S.NavItem>
          );
        })}

        <S.NavItem>
          <S.NavLinkBtn onClick={handleLogout} aria-label="Log out">
            <sidebarLogout.icon aria-hidden="true" />
            {sidebarLogout.label}
          </S.NavLinkBtn>
        </S.NavItem>
      </S.NavList>
    </S.Nav>
  );
};

export default memo(SideBar);