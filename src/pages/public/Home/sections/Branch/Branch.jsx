import { memo, useState, useCallback } from "react";

import SectionTitle from "../../../../../components/common/SectionTitle";
import BranchCard from "../../../../../components/ui/Card/BranchCard";
import BranchModal from "../../../../../components/ui/Modal/BranchModal";
import { branches, heading } from "../../../../../data/HomePage/branch";
import * as S from "./Branch.styled";

const Branch = () => {
  const [selectedBranch, setSelectedBranch] = useState(null);

  const handleOpen = useCallback((branch) => setSelectedBranch(branch), []);
  const handleClose = useCallback(() => setSelectedBranch(null), []);

  return (
    <S.Section id="branches" aria-labelledby={heading.headingId}>
      <SectionTitle
        eyebrow={heading.eyebrow}
        headingStart={heading.headingStart}
        headingAccent={heading.headingAccent}
        id={heading.headingId}
      />

      <S.BranchGrid>
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} onOpen={handleOpen} />
        ))}
      </S.BranchGrid>

      <BranchModal
        branch={selectedBranch}
        open={!!selectedBranch}
        onClose={handleClose}
      />
    </S.Section>
  );
};

export default memo(Branch);
