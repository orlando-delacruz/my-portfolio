// src\pages\admin\Calendar\sections\Toolbar\Toolbar.jsx
import { memo, useCallback, useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import BranchLegendCard from "../../../../../components/admin/Card/BranchLegendCard";
import useCalendarStore from "../../../../../store/useCalendarStore";
import * as S from "./Toolbar.styled";

const Toolbar = () => {
  const currentMonth = useCalendarStore((s) => s.currentMonth);
  const goToToday = useCalendarStore((s) => s.goToToday);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);

  const monthLabel = useMemo(() => currentMonth.format("MMMM YYYY"), [currentMonth]);

  const handlePrev = useCallback(() => goToPrevMonth(), [goToPrevMonth]);
  const handleNext = useCallback(() => goToNextMonth(), [goToNextMonth]);
  const handleToday = useCallback(() => goToToday(), [goToToday]);

  return (
    <S.ToolbarWrapper>
      <S.NavRow>
        <S.NavButton type="button" onClick={handleToday}>
          Today
        </S.NavButton>
        <S.IconButton
          type="button"
          onClick={handlePrev}
          aria-label="Previous month"
        >
          <LuChevronLeft aria-hidden="true" />
        </S.IconButton>
        <S.IconButton
          type="button"
          onClick={handleNext}
          aria-label="Next month"
        >
          <LuChevronRight aria-hidden="true" />
        </S.IconButton>
        <S.MonthLabel aria-live="polite">{monthLabel}</S.MonthLabel>
      </S.NavRow>

      <BranchLegendCard />
    </S.ToolbarWrapper>
  );
};

export default memo(Toolbar); 