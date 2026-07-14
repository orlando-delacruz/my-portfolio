// src/components/admin/SideBar/SideBar.jsx
import { memo, useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import { sidebarNavItems, sidebarLogout } from '../../../data/admin/sidebar';
import { useLogoutStore } from '../../../store/useLogoutStore';
import Logo from '../../../assets/images/logo-white.webp';
import * as S from './SideBar.styled';

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const openLogoutModal = useLogoutStore((s) => s.openLogoutModal);
  const [expandedKeys, setExpandedKeys] = useState([]);

  const handleNav = useCallback((path) => navigate(path), [navigate]);

  const handleLogout = useCallback(() => {
    openLogoutModal();
  }, [openLogoutModal]);

  const toggleExpand = useCallback((key) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const isActive = useCallback((path) => {
    if (!path) return false;
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  }, [location]);

  const renderNavItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedKeys.includes(item.key);
    const Icon = item.icon;

    // Handle external link
    if (item.external) {
      return (
        <S.NavItem key={item.key}>
          <S.NavLink
            as="a"
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            $active={false}
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
          </S.NavLink>
        </S.NavItem>
      );
    }

    if (hasChildren) {
      return (
        <S.NavItem key={item.key}>
          <S.NavLinkBtn
            $active={false}
            onClick={() => toggleExpand(item.key)}
            aria-expanded={isExpanded}
          >
            <Icon aria-hidden="true" />
            <span>{item.label}</span>
            <S.ExpandIcon $expanded={isExpanded}>
              <DownOutlined />
            </S.ExpandIcon>
          </S.NavLinkBtn>
          <S.SubNavList $expanded={isExpanded}>
            {item.children.map((child) => {
              const ChildIcon = child.icon || (() => null);
              const active = isActive(child.path);
              return (
                <S.NavItem key={child.key}>
                  <S.NavLinkBtn
                    $active={active}
                    onClick={() => handleNav(child.path)}
                    aria-current={active ? 'page' : undefined}
                    $nested
                  >
                    <ChildIcon aria-hidden="true" />
                    <span>{child.label}</span>
                  </S.NavLinkBtn>
                </S.NavItem>
              );
            })}
          </S.SubNavList>
        </S.NavItem>
      );
    }

    const active = isActive(item.path);
    return (
      <S.NavItem key={item.key}>
        <S.NavLinkBtn
          $active={active}
          onClick={() => handleNav(item.path)}
          aria-current={active ? 'page' : undefined}
        >
          <Icon aria-hidden="true" />
          <span>{item.label}</span>
        </S.NavLinkBtn>
      </S.NavItem>
    );
  };

  return (
    <S.Nav role="navigation" aria-label="Admin navigation">
      <S.Brand>
        <S.BrandLogo src={Logo} alt="Leidi Bud Dentals" width={46} height={46} />
        <S.BrandName>LeidiBud Dentals</S.BrandName>
      </S.Brand>

      <S.NavList>
        {sidebarNavItems.map(renderNavItem)}

        <S.NavItem>
          <S.NavLinkBtn onClick={handleLogout} aria-label="Log out">
            <sidebarLogout.icon aria-hidden="true" />
            <span>{sidebarLogout.label}</span>
          </S.NavLinkBtn>
        </S.NavItem>
      </S.NavList>
    </S.Nav>
  );
};

export default memo(SideBar);