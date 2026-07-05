// src/hooks/useMobileFilter.js
import { useState, useEffect, useCallback, useRef } from "react";

const MOBILE_BREAKPOINT = 768; // px

export function useMobileFilter() {
  // Initialize isMobile directly with a function to avoid effect setState
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= MOBILE_BREAKPOINT,
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use a ref to track the previous mobile state across renders
  const previousIsMobileRef = useRef(isMobile);

  useEffect(() => {
    const handleResize = () => {
      const currentIsMobile = window.innerWidth <= MOBILE_BREAKPOINT;

      // Only update if the value actually changed
      if (currentIsMobile !== previousIsMobileRef.current) {
        setIsMobile(currentIsMobile);

        // If transitioning from mobile to desktop, close the filter
        if (previousIsMobileRef.current && !currentIsMobile) {
          setIsFilterOpen(false);
        }
        previousIsMobileRef.current = currentIsMobile;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
