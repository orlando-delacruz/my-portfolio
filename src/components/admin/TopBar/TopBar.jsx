// src/components/admin/TopBar/TopBar.jsx
import { memo } from "react";
import { MdMenu, MdNotifications } from "react-icons/md";
import useAdminStore from "../../../store/useAdminStore";
import * as S from "./TopBar.styled";

/**
 * @param {object}   user
 * @param {function} onMenuClick
 */
const TopBar = ({ user, onMenuClick }) => {
  const toggleSidebar = useAdminStore((s) => s.toggleSidebar);

  return (
    <S.Bar role="banner">
      <S.LeftGroup>
        {/* Desktop: collapses the sidebar column */}
        <S.DesktopHamburgerBtn
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MdMenu aria-hidden="true" />
        </S.DesktopHamburgerBtn>

        {/* Mobile: opens the drawer overlay */}
        <S.MobileHamburgerBtn
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <MdMenu aria-hidden="true" />
        </S.MobileHamburgerBtn>
      </S.LeftGroup>

      <S.RightGroup>
        <S.NotifButton aria-label="View notifications">
          <MdNotifications aria-hidden="true" />
          <S.NotifBadge aria-hidden="true" />
        </S.NotifButton>

        <S.UserBlock>
          <S.UserAvatar
            src={user?.avatarUrl ?? "https://picsum.photos/seed/admin-user/40/40"}
            alt={`${user?.name ?? "Admin"} profile photo`}
            width={38}
            height={38}
            loading="eager"
          />
          <S.UserInfo>
            <S.UserName>{user?.name ?? "Dra. Yenyen Galabit"}</S.UserName>
            <S.UserRole>{user?.role ?? "Super Admin"}</S.UserRole>
          </S.UserInfo>
        </S.UserBlock>
      </S.RightGroup>
    </S.Bar>
  );
};

export default memo(TopBar);