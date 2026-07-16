// src/routes/PublicRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "../utils/ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";
import { useAuthStore } from "../store/authStore";
import CancelAppointment from '../pages/public/CancelAppointment';
import Unauthorized from '../pages/auth/Unauthorized';
import NotFound from '../pages/NotFound';

// ── Lazy pages ──
const Home = lazy(() => import("../pages/public/Home"));
const BookAppointment = lazy(() => import("../pages/public/BookAppointment"));
const Login = lazy(() => import("../pages/auth"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard/Dashboard"));
const Appointment = lazy(() => import("../pages/admin/Appointment"));
const Patients = lazy(() => import("../pages/admin/Patients"));
const ClinicClosures = lazy(() => import("../pages/admin/ClinicClosures"));
const AppointmentCalendar = lazy(() => import("../pages/admin/Calendar/AppointmentCalendar"));
const Users = lazy(() => import("../pages/admin/Users"));
const Settings = lazy(() => import("../pages/admin/Settings"));

// ── CMS pages ──
const ComingSoon = lazy(() => import("../pages/admin/CMS/ComingSoon"));
const Hero = lazy(() => import("../pages/admin/CMS/Hero/Hero"));
const About = lazy(() => import("../pages/admin/CMS/About"));
const Gallery = lazy(() => import("../pages/admin/CMS/Gallery"));
const WhyChooseUs = lazy(() => import("../pages/admin/CMS/WhyChooseUs"));
const Services = lazy(() => import("../pages/admin/CMS/Services/Services"));
const Branches = lazy(() => import("../pages/admin/CMS/Branches"));

// ── Fallbacks ──
const PageFallback = () => (
  <div
    style={{ minHeight: "100dvh", background: "#fff" }}
    role="status"
    aria-label="Loading page"
  />
);

function GuestRoute({ children }) {
  const loading = useAuthStore((s) => s.loading);
  const isAuthorized = useAuthStore((s) => s.isAuthorized);

  if (loading) {
    return <PageFallback />;
  }

  if (isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default function PublicRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/cancel-appointment" element={<CancelAppointment />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

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
          <Route path="/admin" element={<Dashboard />} />
          <Route path="appointments" element={<Appointment />} />
          <Route path="calendar" element={<AppointmentCalendar />} />
          <Route path="clinic-closures" element={<ClinicClosures />} />
          <Route path="patients" element={<Patients />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />

          {/* CMS Routes */}
          <Route path="cms">
            <Route path="services" element={<Services />} />
            <Route path="hero" element={<Hero />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="why-choose-us" element={<WhyChooseUs />} />
            <Route path="branches" element={<Branches />} />
            <Route path="testimonials" element={<ComingSoon title="Testimonials" />} />
            <Route path="faqs" element={<ComingSoon title="FAQs" />} />
            <Route path="contact" element={<ComingSoon title="Contact Section" />} />
            <Route path="footer" element={<ComingSoon title="Footer" />} />
          </Route>
        </Route>

        {/* 404 Fallback – must be the last route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}