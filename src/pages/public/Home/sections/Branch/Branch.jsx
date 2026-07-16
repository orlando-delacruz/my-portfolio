// src/pages/public/Home/sections/Branch/Branch.jsx
import { memo, useState, useCallback, useMemo } from "react";
import { Alert } from "antd";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiMail,
} from "react-icons/fi";

import SectionTitle from "../../../../../components/common/SectionTitle";
import BranchCard from "../../../../../components/ui/Card/BranchCard";
import BranchModal from "../../../../../components/ui/Modal/BranchModal";
import Loading from "../../../../../components/common/Loading";
import { useBranchesSection } from "../../../../../hooks/cms/useBranches";
import * as S from "./Branch.styled";

const transformBranchItem = (item) => {
  const servicesList = item.services
    ? item.services.split("\n").filter((s) => s.trim())
    : [];

  return {
    id: item.id,
    name: item.name,
    location: item.location,
    mapSrc: item.map_embed_url,
    contact: [
      {
        icon: FiMapPin,
        label: "Address",
        value: item.address,
      },
      {
        icon: FiPhone,
        label: "Phone",
        value: item.phone,
        href: `tel:${item.phone.replace(/\s/g, "")}`,
      },
      {
        icon: FiClock,
        label: "Hours",
        value: item.hours,
      },
      {
        icon: FiMail,
        label: "Email",
        value: item.email,
        href: `mailto:${item.email}`,
      },
    ],
    services: servicesList,
  };
};

const Branch = () => {
  const { data: section, isLoading, error } = useBranchesSection();
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleOpen = useCallback((branch) => setSelectedBranch(branch), []);
  const handleClose = useCallback(() => setSelectedBranch(null), []);

  const transformed = useMemo(() => {
    if (!section) return { heading: null, branches: [] };
    const { pre_title, title, highlight_text, items = [] } = section;
    return {
      heading: {
        eyebrow: pre_title,
        headingStart: title,
        headingAccent: highlight_text,
        headingId: "branches-heading",
      },
      branches: items.map(transformBranchItem),
    };
  }, [section]);

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !section) {
    return (
      <S.Section id="branches" aria-labelledby="branches-heading">
        <Alert type="error" title="Failed to load branches" showIcon />
      </S.Section>
    );
  }

  const { heading, branches } = transformed;

  return (
    <S.Section id="branches" aria-labelledby={heading.headingId}>
      <SectionTitle
        eyebrow={heading.eyebrow}
        headingStart={heading.headingStart}
        headingAccent={heading.headingAccent}
        id={heading.headingId}
      />

      {branches.length === 0 ? (
        <S.EmptyState>No branches available at the moment.</S.EmptyState>
      ) : (
        <S.BranchGrid>
          {branches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} onOpen={handleOpen} />
          ))}
        </S.BranchGrid>
      )}

      <BranchModal
        branch={selectedBranch}
        open={!!selectedBranch}
        onClose={handleClose}
      />
    </S.Section>
  );
};

export default memo(Branch);