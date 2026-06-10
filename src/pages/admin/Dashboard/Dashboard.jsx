import { memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "antd";
import { MdLogout, MdPerson } from "react-icons/md";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { signOut } from "../../../services/supabase/auth";
import theme from "../../../styles/theme";

// ── Styles ────────────────────────────────────────────────────────────────────

const Wrapper = styled.main`
  min-height: 100dvh;
  background: ${theme.colors.secondary};
  display: flex;
  flex-direction: column;
`;

const Topbar = styled.header`
  background: ${theme.colors.white};
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

  @media ${theme.media.mobile} {
    padding: 14px 20px;
  }
`;

const BrandName = styled.span`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.size.md};
  font-weight: ${theme.typography.weight.medium};
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.black};
  font-size: ${theme.typography.size.sm};
  font-weight: ${theme.typography.weight.medium};

  svg {
    color: ${theme.colors.primary};
    font-size: 20px;
  }
`;

const Content = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
`;

const Card = styled.div`
  background: ${theme.colors.white};
  border-radius: 20px;
  padding: 48px 56px;
  text-align: center;
  box-shadow: 1px 1px 4px 1px rgba(0, 0, 0, 0.1);
  max-width: 480px;
  width: 100%;

  @media ${theme.media.mobile} {
    padding: 32px 24px;
  }
`;

const Greeting = styled.h1`
  color: ${theme.colors.black};
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: ${theme.typography.weight.medium};
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: ${theme.typography.size.body};
  margin-bottom: 32px;
`;

const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.colors.secondary};
  border: 3px solid ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 36px;
  color: ${theme.colors.primary};
`;

// ── Component ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  async function handleSignOut() {
    await signOut();
    navigate("/login", { replace: true });
  }

  const displayName =
    user?.full_name ?? user?.email?.split("@")[0] ?? "Admin";

  return (
    <Wrapper>
      {/* Top navigation bar */}
      <Topbar>
        <BrandName>Leidi Bud Dentals — Admin</BrandName>
        <UserChip>
          <MdPerson aria-hidden="true" />
          <span>{loading ? "…" : displayName}</span>
          <Button
            type="text"
            danger
            icon={<MdLogout aria-hidden="true" />}
            onClick={handleSignOut}
            aria-label="Sign out"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            Sign out
          </Button>
        </UserChip>
      </Topbar>

      {/* Main content */}
      <Content aria-labelledby="dashboard-heading">
        <Card>
          <AvatarCircle aria-hidden="true">
            <MdPerson />
          </AvatarCircle>
          <Greeting id="dashboard-heading">
            Welcome,&nbsp;
            {loading ? "…" : displayName}
          </Greeting>
          <Subtitle>
            You are logged in to the Leidi Bud Dentals admin panel.
          </Subtitle>
          <Button
            type="primary"
            size="large"
            style={{
              background: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: 50,
              fontWeight: theme.typography.weight.medium,
            }}
          >
            Go to Appointments
          </Button>
        </Card>
      </Content>
    </Wrapper>
  );
}

export default memo(Dashboard);