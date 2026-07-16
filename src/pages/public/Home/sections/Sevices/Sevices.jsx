// src/pages/public/Home/sections/Services/Sevices.jsx
import { memo } from "react";
import * as S from "./Services.styled";
import SectionTitle from "../../../../../components/common/SectionTitle";
import { ServiceCard } from "../../../../../components/ui/Card/ServiceCard";
import { ServiceModal } from "../../../../../components/ui/Modal/ServiceModal";
import { useServices } from "./useServices";
import { useServicesSection } from "../../../../../hooks/cms/useCmsServices";
import Loading from "../../../../../components/common/Loading";
import { Alert } from "antd";

const Services = () => {
  const { data: section, isLoading: sectionLoading, error: sectionError } = useServicesSection();
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
    isLoading: servicesLoading,
    error: servicesError,
  } = useServices();

  if (sectionLoading || servicesLoading) {
    return <Loading fullscreen />;
  }

  if (sectionError || servicesError || !section) {
    return (
      <S.ServicesSection id="services" aria-labelledby="services-heading">
        <Alert type="error" title="Failed to load services" showIcon />
      </S.ServicesSection>
    );
  }

  const { pre_title, title, highlight_text } = section;

  return (
    <S.ServicesSection id="services" aria-labelledby="services-heading">
      <SectionTitle
        eyebrow={pre_title}
        headingStart={title}
        headingAccent={highlight_text}
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
            {expanded ? "Show Less" : "View All Services"}
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