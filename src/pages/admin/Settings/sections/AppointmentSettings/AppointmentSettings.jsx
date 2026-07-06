// src/pages/admin/Settings/sections/AppointmentSettings/AppointmentSettings.jsx
import { memo, useState, useCallback } from "react";
import { Select, Button, message, Skeleton } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import {
  SETTINGS_SECTION_ICONS,
  INTERVAL_OPTIONS,
  ADVANCE_BOOKING_OPTIONS,
  CANCELLATION_OPTIONS,
  DURATION_OPTIONS,
} from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./AppointmentSettings.styled";

const { Option } = Select;

const AppointmentSettings = () => {
  const icon = SETTINGS_SECTION_ICONS.appointment;
  const [saving, setSaving] = useState(false);

  // ✅ Individual selectors - stable references
  const settings = useSettingsStore((state) => state.appointmentSettings);
  const loading = useSettingsStore((state) => state.loading);
  const updateAppointmentSetting = useSettingsStore((state) => state.updateAppointmentSetting);

  const handleChange = useCallback((field, value) => {
    updateAppointmentSetting(field, value);
  }, [updateAppointmentSetting]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      message.success("Appointment settings saved successfully!");
    } catch {
      message.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="Appointment Settings" subtitle="Configure Appointment Preferences">
        <S.Container>
          <Skeleton active paragraph={{ rows: 4 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="Appointment Settings" subtitle="Configure Appointment Preferences">
      <S.Container>
        <S.FieldGroup>
          <S.FieldLabel>Appointment Interval</S.FieldLabel>
          <Select value={settings.intervalMinutes} onChange={(val) => handleChange("intervalMinutes", val)} style={{ width: "100%" }} size="small">
            {INTERVAL_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Advance Booking</S.FieldLabel>
          <Select value={settings.advanceBookingDays} onChange={(val) => handleChange("advanceBookingDays", val)} style={{ width: "100%" }} size="small">
            {ADVANCE_BOOKING_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Cancellation Notice</S.FieldLabel>
          <Select value={settings.cancellationHours} onChange={(val) => handleChange("cancellationHours", val)} style={{ width: "100%" }} size="small">
            {CANCELLATION_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Default Appointment Duration</S.FieldLabel>
          <Select value={settings.defaultDurationMinutes} onChange={(val) => handleChange("defaultDurationMinutes", val)} style={{ width: "100%" }} size="small">
            {DURATION_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.ActionRow>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}
          >
            Save Settings
          </Button>
        </S.ActionRow>
      </S.Container>
    </SettingsCard>
  );
};

export default memo(AppointmentSettings);