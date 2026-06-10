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

// ── Fallbacks ─────────────────────────────────────────────────────────────────

const PageFallback = () => (
  <div
    style={{ minHeight: "100dvh", background: "#fff" }}
    role="status"
    aria-label="Loading page"
  />
);

/**
 * Redirects already-authenticated users away from /login back to the dashboard.
 */
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

        {/* Auth — redirect if already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        {/* Protected admin area */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}