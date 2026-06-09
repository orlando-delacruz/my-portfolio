// src/pages/public/Home/index.jsx
import { Suspense, lazy } from "react";
import Header from "../../../components/layout/Header/Header";
import Hero from "./sections/Hero";

const About = lazy(() => import("./sections/About"));
const Services = lazy(() => import("./sections/Sevices"));
const Gallery = lazy(() => import("./sections/Gallery"));
const WhyUs = lazy(() => import("./sections/WhyUs"));
const Branch = lazy(() => import("./sections/Branch"));


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
      <Suspense fallback={<SectionFallback />}><About /></Suspense>
      <Suspense fallback={<SectionFallback />}><Services /></Suspense>
      <Suspense fallback={<SectionFallback />}><Gallery /></Suspense>
      <Suspense fallback={<SectionFallback />}><WhyUs /></Suspense>
      <Suspense fallback={<SectionFallback />}><Branch /></Suspense>
    </main>
  </>
);

export default Home;