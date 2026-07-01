// src\pages\admin\Calendar\AppointmentCalendar\AppointmentCalendar.jsx
import { memo } from "react";
import PageTitle from "../sections/PageTitle";
import Toolbar from "../sections/Toolbar";
import ScheduleCalendar from "../sections/ScheduleCalendar";
import * as S from "./AppointmentCalendar.styled";
import AdminLayout from "../../../../components/admin/AdminLayout";

const AppointmentCalendar = () => (
  <>
    <AdminLayout>
      <S.PageRoot>
        <PageTitle />

        <S.CalendarArea>
          <Toolbar />
          <ScheduleCalendar />
        </S.CalendarArea>
      </S.PageRoot>
    </AdminLayout>
  </>
);

export default memo(AppointmentCalendar);