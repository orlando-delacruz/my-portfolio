// src/pages/admin/Settings/sections/OperatingHours/BranchTabs.jsx
import { memo } from "react";
import { BRANCH_OPTIONS } from "../../../../../data/admin/settings";
import * as S from "./BranchTabs.styled";

const BranchTabs = memo(({ activeBranch, onBranchChange }) => {
  return (
    <S.TabsContainer role="tablist" aria-label="Select branch for operating hours">
      {BRANCH_OPTIONS.map((branch) => {
        const isActive = activeBranch === branch.id;
        return (
          <S.Tab
            key={branch.id}
            role="tab"
            aria-selected={isActive}
            $active={isActive}
            onClick={() => onBranchChange(branch.id)}
          >
            {branch.label}
          </S.Tab>
        );
      })}
    </S.TabsContainer>
  );
});

BranchTabs.displayName = "BranchTabs";
export default BranchTabs;