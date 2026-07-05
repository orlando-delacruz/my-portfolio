// src/hooks/useMobileFilter.js
import { useState, useEffect, useCallback } from "react";

const MOBILE_BREAKPOINT = 768; // px

export function useMobileFilter() {
  const [isMobile, setIsMobile] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close filter when switching from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsFilterOpen(false);
    }
  }, [isMobile]);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  return {
    isMobile,
    isFilterOpen,
    toggleFilter,
    closeFilter,
    // For desktop, filters should always be visible
    showFilters: isMobile ? isFilterOpen : true,
  };
}
