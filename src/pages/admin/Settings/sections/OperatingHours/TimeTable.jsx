// src/pages/admin/Settings/sections/OperatingHours/TimeTable.jsx
import { memo, useCallback } from "react";
import { Select, Switch } from "antd";
import * as S from "./TimeTable.styled";

const { Option } = Select;

const TIME_OPTIONS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00",
];

const DAY_LABELS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

const TimeTable = memo(({ branchId, hours, onUpdateHour }) => {
  const handleTimeChange = useCallback((dayIndex, field, value) => {
    if (!value) return;
    onUpdateHour(branchId, dayIndex, field, value);
  }, [branchId, onUpdateHour]);

  const handleToggleClosed = useCallback((dayIndex, checked) => {
    onUpdateHour(branchId, dayIndex, "isClosed", !checked);
  }, [branchId, onUpdateHour]);

  // Ensure hours is an array of 7 items
  const safeHours = hours && hours.length === 7 ? hours : [];

  return (
    <S.TableWrapper>
      <S.StyledTable>
        <S.Thead>
          <S.Tr>
            <S.Th>Day</S.Th>
            <S.Th>Open</S.Th>
            <S.Th>Closing</S.Th>
            <S.Th>Closed</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>
          {safeHours.map((hour, index) => {
            // ✅ Stable key: use hour.id if exists, else composite
            const key = hour.id ? hour.id : `${branchId}-${hour.dayOfWeek}`;

            return (
              <S.Tr key={key}>
                <S.Td>{DAY_LABELS[hour.dayOfWeek] || "—"}</S.Td>
                <S.Td>
                  <Select
                    value={hour.isClosed ? undefined : hour.openTime}
                    onChange={(val) => handleTimeChange(index, "openTime", val)}
                    disabled={hour.isClosed}
                    placeholder="—"
                    style={{ width: 90 }}
                    size="small"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <Option key={t} value={t}>{t}</Option>
                    ))}
                  </Select>
                </S.Td>
                <S.Td>
                  <Select
                    value={hour.isClosed ? undefined : hour.closeTime}
                    onChange={(val) => handleTimeChange(index, "closeTime", val)}
                    disabled={hour.isClosed}
                    placeholder="—"
                    style={{ width: 90 }}
                    size="small"
                  >
                    {TIME_OPTIONS.map((t) => (
                      <Option key={t} value={t}>{t}</Option>
                    ))}
                  </Select>
                </S.Td>
                <S.Td>
                  <Switch
                    checked={hour.isClosed}
                    onChange={(checked) => handleToggleClosed(index, checked)}
                    size="small"
                  />
                </S.Td>
              </S.Tr>
            );
          })}
        </S.Tbody>
      </S.StyledTable>
    </S.TableWrapper>
  );
});

TimeTable.displayName = "TimeTable";
export default TimeTable;