// src/pages/public/Home/sections/Services/useServices.js
import { useState, useCallback, useMemo, useEffect } from "react";
import { useCmsServicesHomepage } from "../../../../../hooks/cms/useCmsServices";
import { useBranches } from "../../../../../hooks/useBranches";

// Map CMS service to the shape expected by the UI
const mapService = (cmsService) => ({
  id: cmsService.id,
  title: cmsService.title || "",
  titleTl: cmsService.title_tagalog || "",
  shortDesc: cmsService.short_description || "",
  fullDesc: cmsService.full_description || "",
  image:
    cmsService.featured_image || "https://picsum.photos/seed/dental/600/300",
  imageAlt: cmsService.title || "Dental Service",
  starting_price: cmsService.starting_price || 0,
  maximum_price: cmsService.maximum_price || 0,
});

export const useServices = () => {
  const { data: cmsServices, isLoading, error } = useCmsServicesHomepage();
  const { branches: allBranches } = useBranches();

  const branchMap = useMemo(() => {
    if (!cmsServices) return {};
    const map = {};
    cmsServices.forEach((service) => {
      if (service.branch_ids && service.branch_ids.length) {
        service.branch_ids.forEach((branchId) => {
          if (!map[branchId]) map[branchId] = [];
          map[branchId].push(mapService(service));
        });
      }
    });
    return map;
  }, [cmsServices]);

  const branches = useMemo(() => {
    if (!allBranches) return [];
    return allBranches
      .filter((b) => branchMap[b.id] && branchMap[b.id].length > 0)
      .map((b) => ({
        id: b.id,
        label: b.name,
        items: branchMap[b.id] || [],
      }));
  }, [allBranches, branchMap]);

  const [activeBranchId, setActiveBranchId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (branches.length > 0 && !activeBranchId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveBranchId(branches[0].id);
    }
  }, [branches, activeBranchId]);

  const activeBranch = useMemo(
    () => branches.find((b) => b.id === activeBranchId),
    [branches, activeBranchId],
  );

  const initialCount = 6;
  const visibleServices = useMemo(
    () =>
      expanded
        ? activeBranch?.items || []
        : (activeBranch?.items || []).slice(0, initialCount),
    [expanded, activeBranch, initialCount],
  );

  const hasMore = (activeBranch?.items?.length || 0) > initialCount;

  const handleBranchChange = useCallback((branchId) => {
    setActiveBranchId(branchId);
    setExpanded(false);
  }, []);

  const handleViewDetails = useCallback((service) => {
    setSelectedService(service);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedService(null);
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return {
    branches,
    activeBranchId,
    visibleServices,
    hasMore,
    expanded,
    selectedService,
    modalOpen,
    handleBranchChange,
    handleViewDetails,
    handleCloseModal,
    handleToggleExpand,
    isLoading,
    error,
  };
};
