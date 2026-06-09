// src/pages/public/Home/index.jsx
import { Suspense, lazy } from "react";
import Header from "../../../components/layout/Header/Header";
import Hero from "./sections/Hero";

const About = lazy(() => import("./sections/About"));

const SectionFallback = () => (
  <div
    style={{ minHeight: "60vh", background: "#fff" }}
    role="status"
    aria-label="Loading section"
  />
);

const Home = () => (
  <>
    <Header />
    <main id="main-content">
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
    </main>
  </>
);

export default Home;