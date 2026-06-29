// src/components/admin/SideBar/SideBar.jsx
import { memo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarNavItems, sidebarLogout } from "../../../data/admin/sidebar";
import Logo from "../../../assets/images/logo-white.webp";
import * as S from "./SideBar.styled";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = useCallback(
    (path) => navigate(path),
    [navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      await supabase.auth.signOut();
    } finally {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <S.Nav role="navigation" aria-label="Admin navigation">
      {/* Brand */}
      <S.Brand>
        <S.BrandLogo src={Logo} alt="Leidi Bud Dentals" width={46} height={46} />
        <S.BrandName>LeidiBud Dentals</S.BrandName>
      </S.Brand>

      {/* Nav links */}
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

        {/* Logout */}
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