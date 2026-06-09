// src/pages/public/Home/index.jsx
import { Suspense, lazy } from "react";
import Header from "../../../components/layout/Header/Header";

const Hero = lazy(() => import("./sections/Hero"));

const SectionFallback = () => (
  <div
    style={{ minHeight: "100dvh", background: "#FFFFFF" }}
    role="status"
    aria-label="Loading section"
  />
);

const Home = () => (
  <>
    <Header />
    <main id="main-content">
      <Suspense fallback={<SectionFallback />}>
        <Hero />
      </Suspense>
    </main>
  </>
);

export default Home;