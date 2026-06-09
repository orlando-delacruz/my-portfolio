// src/components/layout/Header/useHeader.js
import { useState, useCallback, useEffect } from "react";

export function useHeader(initialLinks) {
  const [links, setLinks] = useState(initialLinks);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setActive = useCallback((href) => {
    setLinks((prev) =>
      prev.map((link) => ({ ...link, active: link.href === href }))
    );
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return { links, setActive, mobileOpen, toggleMobile, closeMobile, scrolled };
}