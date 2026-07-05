// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        role="status"
        aria-label="Verifying session…"
      >
        <Spin size="large" />
      </div>
    );
  }

  // User must be authenticated and have a valid admin profile
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}