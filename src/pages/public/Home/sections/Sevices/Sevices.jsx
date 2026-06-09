// src/pages/public/Home/sections/Services/Services.jsx
import { memo } from "react";
import * as S from "./Services.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { ServiceCard } from "../../../../../components/ui/Card/ServiceCard";
import { ServiceModal } from "../../../../../components/ui/Modal/ServiceModal";
import { useServices } from "./useServices";
import { services } from "../../../../../data/HomePage/services";

const Services = () => {
  const {
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
  } = useServices();

  const { eyebrow, headingStart, headingAccent, viewAllLabel } = services;

  return (
    <S.ServicesSection id="services" aria-labelledby="services-heading">
      <SectionTitle
        eyebrow={eyebrow}
        headingStart={headingStart}
        headingAccent={headingAccent}
        id="services-heading"
      />

      <S.ServicesBody>
        {/* Branch tabs */}
        <S.TabRow role="tablist" aria-label="Select branch">
          {branches.map((branch) => (
            <S.TabButton
              key={branch.id}
              role="tab"
              aria-selected={activeBranchId === branch.id}
              $active={activeBranchId === branch.id}
              onClick={() => handleBranchChange(branch.id)}
            >
              {branch.label}
            </S.TabButton>
          ))}
        </S.TabRow>

        {/* Cards grid */}
        <S.CardsWrapper>
          <S.CardsGrid
            id="services-grid"
            role="tabpanel"
            aria-label="Services for selected branch"
          >
            {visibleServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onViewDetails={handleViewDetails}
              />
            ))}
          </S.CardsGrid>
        </S.CardsWrapper>

        {/* View All / Collapse toggle */}
        {hasMore && (
          <S.ViewAllButton
            onClick={handleToggleExpand}
            aria-expanded={expanded}
            aria-controls="services-grid"
          >
            {expanded ? "Show Less" : viewAllLabel}
          </S.ViewAllButton>
        )}
      </S.ServicesBody>

      <ServiceModal
        service={selectedService}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </S.ServicesSection>
  );
};

export default memo(Services);