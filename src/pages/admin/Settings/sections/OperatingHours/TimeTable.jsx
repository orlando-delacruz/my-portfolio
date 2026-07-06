// src/pages/admin/Settings/sections/OperatingHours/TimeTable.jsx
import { memo } from "react";
import { Switch } from "antd";
import { TIME_OPTIONS } from "../../../../../data/admin/settings";
import * as S from "./TimeTable.styled";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const TimeTable = memo(({ branchId, hours, onUpdateHour }) => {
  const handleTimeChange = (dayIndex, field, value) => {
    onUpdateHour(branchId, dayIndex, field, value);
  };

  const handleClosedToggle = (dayIndex, checked) => {
    onUpdateHour(branchId, dayIndex, "isClosed", checked);
    if (checked) {
      onUpdateHour(branchId, dayIndex, "open", null);
      onUpdateHour(branchId, dayIndex, "close", null);
    }
  };

  return (
    <S.TableWrapper>
      <S.Table>
        <S.Thead>
          <S.Tr>
            <S.Th>Day</S.Th>
            <S.Th>Open</S.Th>
            <S.Th>Closing</S.Th>
            <S.Th>Closed</S.Th>
          </S.Tr>
        </S.Thead>
        <S.Tbody>
          {hours.map((day, index) => {
            const dayLabel = DAY_LABELS[day.day] || `Day ${day.day}`;
            return (
              <S.Tr key={day.day}>
                <S.Td>{dayLabel}</S.Td>
                <S.Td>
                  <S.TimeSelect
                    value={day.open || undefined}
                    onChange={(value) => handleTimeChange(index, "open", value)}
                    disabled={day.isClosed}
                  >
                    <option value="">--</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </S.TimeSelect>
                </S.Td>
                <S.Td>
                  <S.TimeSelect
                    value={day.close || undefined}
                    onChange={(value) => handleTimeChange(index, "close", value)}
                    disabled={day.isClosed}
                  >
                    <option value="">--</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </S.TimeSelect>
                </S.Td>
                <S.Td>
                  <Switch
                    size="small"
                    checked={day.isClosed}
                    onChange={(checked) => handleClosedToggle(index, checked)}
                    aria-label={`Toggle closed for ${dayLabel}`}
                  />
                </S.Td>
              </S.Tr>
            );
          })}
        </S.Tbody>
      </S.Table>
    </S.TableWrapper>
  );
});

TimeTable.displayName = "TimeTable";
export default TimeTable;