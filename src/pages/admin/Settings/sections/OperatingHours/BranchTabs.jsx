// src/pages/admin/Settings/sections/OperatingHours/BranchTabs.jsx
import { memo } from "react";
import * as S from "./BranchTabs.styled";

const BranchTabs = memo(({ branches, activeBranch, onBranchChange }) => {
  if (!branches || branches.length === 0) return null;

  return (
    <S.TabsContainer>
      {branches.map((branch) => (
        <S.TabButton
          key={branch.id} // ✅ branch.id is UUID, stable
          $active={activeBranch === branch.id}
          onClick={() => onBranchChange(branch.id)}
        >
          {branch.name}
        </S.TabButton>
      ))}
    </S.TabsContainer>
  );
});

BranchTabs.displayName = "BranchTabs";
export default BranchTabs;