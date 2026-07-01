// src\pages\admin\Calendar\sections\PageTitle\PageTitle.jsx
import { memo, useCallback } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Filters from "../../../../../components/admin/Filter/Filters";
import useCalendarStore from "../../../../../store/useCalendarStore";
import * as S from "./PageTitle.styled";

const PageTitle = () => {
  const branchId = useCalendarStore((s) => s.branchId);
  const setBranchId = useCalendarStore((s) => s.setBranchId);

  const handleBranchChange = useCallback(
    (val) => setBranchId(val),
    [setBranchId]
  );

  return (
    <S.TitleBar>
      <S.HeadingGroup>
        <S.Heading>Calendar</S.Heading>
        <S.Subtitle>Manage booked appointments and view dentist schedules</S.Subtitle>
      </S.HeadingGroup>

      <Filters branchId={branchId} onBranchChange={handleBranchChange} />
    </S.TitleBar>
  );
};

export default memo(PageTitle);