// src/routes/PublicRoutes.jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home"
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<BookAppointment />} />
    </Routes>
  </Suspense>
);

export default PublicRoutes;