// src/pages/auth/Unauthorized.jsx
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import { supabase } from "../../services/supabase/supabase";
import { useAuthStore } from "../../store/authStore";

const Unauthorized = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clear);

  const handleSignOutAndRedirect = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      clearAuth();
      navigate("/login", { replace: true });
    }
  };

  return (
    <Result
      status="403"
      title="Access Denied"
      subTitle="Your Google account is not registered as an administrator. You have successfully signed in, but your account has not been granted administrator access. If you believe this is a mistake, please contact the system administrator."
      extra={[
        <Button key="home" onClick={() => navigate("/")}>
          Back to Home
        </Button>,
        <Button key="login" type="primary" onClick={handleSignOutAndRedirect}>
          Login with another account
        </Button>,
      ]}
    />
  );
};

export default memo(Unauthorized);