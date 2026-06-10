import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useAuthStore } from "../store/authStore";

/**
 * Wraps admin routes.
 * - While session is loading → shows a full-page spinner.
 * - No authenticated user → redirects to /login.
 * - Authenticated → renders nested <Outlet />.
 */
export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        role="status"
        aria-label="Verifying session…"
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}