// src/pages/admin/Calendar/sections/PageTitle/PageTitle.jsx
import { memo } from 'react';
import Filters from '../../../../../components/admin/Filter/Filters';
import useCalendarStore from '../../../../../store/useCalendarStore';
import * as S from './PageTitle.styled';

const PageTitle = ({ statusFilter, onStatusChange }) => {
  const branchId = useCalendarStore((s) => s.branchId);
  const setBranchId = useCalendarStore((s) => s.setBranchId);

  return (
    <S.TitleBar>
      <S.HeadingGroup>
        <S.Heading>Calendar</S.Heading>
        <S.Subtitle>Manage booked appointments and view dentist schedules</S.Subtitle>
      </S.HeadingGroup>

      <Filters
        branchId={branchId}
        onBranchChange={setBranchId}
        status={statusFilter}
        onStatusChange={onStatusChange}
      />
    </S.TitleBar>
  );
};

export default memo(PageTitle);