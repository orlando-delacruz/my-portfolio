// src/routes/PublicRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home"
import ScrollToTop from "../utils/ScrollToTop";

const BookAppointment = lazy(() => import("../pages/public/BookAppointment"));

const PageFallback = () => (
  <div
    style={{ minHeight: "100dvh", background: "#fff" }}
    role="status"
    aria-label="Loading page"
  />
);

const PublicRoutes = () => (
  <Suspense fallback={<PageFallback />}>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<BookAppointment />} />
    </Routes>
  </Suspense>
);

export default PublicRoutes;