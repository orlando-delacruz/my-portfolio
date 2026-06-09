// src/pages/public/Home/sections/Services/useServices.js
import { useState, useCallback, useMemo } from "react";
import { services } from "../../../../../data/HomePage/services";

export const useServices = () => {
  const { branches, initialCount } = services;

  const [activeBranchId, setActiveBranchId] = useState(branches[0].id);
  const [expanded, setExpanded] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const activeBranch = useMemo(
    () => branches.find((b) => b.id === activeBranchId),
    [branches, activeBranchId],
  );

  const visibleServices = useMemo(
    () =>
      expanded ? activeBranch.items : activeBranch.items.slice(0, initialCount),
    [expanded, activeBranch, initialCount],
  );

  const hasMore = activeBranch.items.length > initialCount;

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
  };
};
