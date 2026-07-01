// src\routes\PublicRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";

// ── Lazy pages ────────────────────────────────────────────────────────────────
const Home = lazy(() => import("../pages/public/Home"));
const BookAppointment = lazy(() => import("../pages/public/BookAppointment"));
const Login = lazy(() => import("../pages/auth"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard/Dashboard"));
const Appointment = lazy(() => import("../pages/admin/Appointment"));
const PageDevelopment = lazy(() => import("../pages/admin/PageDevelopment"));
const AppointmentCalendar = lazy(() => import("../pages/admin/Calendar/AppointmentCalendar"));

// ── Fallbacks ─────────────────────────────────────────────────────────────────
const PageFallback = () => (
  <div
    style={{ minHeight: "100dvh", background: "#fff" }}
    role="status"
    aria-label="Loading page"
  />
);

function GuestRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  if (loading) return <PageFallback />;
  if (user) return <Navigate to="/admin/dashboard" replace />;
  return children;
}

// ── Router ────────────────────────────────────────────────────────────────────
export default function PublicRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Admin (protected) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="calendar" element={<AppointmentCalendar />} />
          <Route path="clinic-closures" element={<PageDevelopment />} />
          <Route path="users" element={<PageDevelopment />} />
          <Route path="settings" element={<PageDevelopment />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}