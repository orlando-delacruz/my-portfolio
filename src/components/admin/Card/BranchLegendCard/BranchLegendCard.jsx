// src\components\admin\Card\BranchLegendCard\BranchLegendCard.jsx
import { memo } from "react";
import { APPOINTMENT_STATUSES, CALENDAR_BRANCHES } from "../../../../constants/calendarConstants";
import * as S from "./BranchLegendCard.styled";

/**
 * Legend row showing status color key + branch initials.
 * Pure presentational — no state of its own.
 */
const BranchLegendCard = () => (
  <S.LegendRow aria-label="Status and branch legend">
    <S.StatusGroup>
      {APPOINTMENT_STATUSES.map((s) => (
        <S.StatusItem key={s.value}>
          <S.Dot $color={s.color} aria-hidden="true" />
          <S.StatusLabel $color={s.color}>{s.label}</S.StatusLabel>
        </S.StatusItem>
      ))}
    </S.StatusGroup>

    {CALENDAR_BRANCHES.map((branch) => (
      <S.BranchItem key={branch.id}>
        <S.BranchBadge $color={branch.color} aria-hidden="true">
          {branch.initial}
        </S.BranchBadge>
        <S.BranchLabel>{branch.name}</S.BranchLabel>
      </S.BranchItem>
    ))}
  </S.LegendRow>
);

export default memo(BranchLegendCard);