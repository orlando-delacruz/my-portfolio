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

  const settings = useSettingsStore((state) => state.appointmentSettings);
  const loading = useSettingsStore((state) => state.loading);
  const updateAppointmentSettings = useSettingsStore((state) => state.updateAppointmentSettings);
  const isSaving = useSettingsStore((state) => state.isSaving);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateAppointmentSettings({
        intervalMinutes: settings.intervalMinutes,
        advanceBookingDays: settings.advanceBookingDays,
        cancellationHours: settings.cancellationHours,
        defaultDurationMinutes: settings.defaultDurationMinutes,
      });
      message.success("Appointment settings saved successfully!");
    } catch (err) {
      message.error(err?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }, [settings, updateAppointmentSettings]);

  // Use the store's updateAppointmentSetting for immediate changes
  const updateSetting = useSettingsStore((state) => state.updateAppointmentSetting);

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
          <Select
            value={settings?.intervalMinutes || 30}
            onChange={(val) => updateSetting("intervalMinutes", val)}
            style={{ width: "100%" }}
            size="small"
          >
            {INTERVAL_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Advance Booking</S.FieldLabel>
          <Select
            value={settings?.advanceBookingDays || 60}
            onChange={(val) => updateSetting("advanceBookingDays", val)}
            style={{ width: "100%" }}
            size="small"
          >
            {ADVANCE_BOOKING_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Cancellation Notice</S.FieldLabel>
          <Select
            value={settings?.cancellationHours || 24}
            onChange={(val) => updateSetting("cancellationHours", val)}
            style={{ width: "100%" }}
            size="small"
          >
            {CANCELLATION_OPTIONS.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </S.FieldGroup>

        <S.FieldGroup>
          <S.FieldLabel>Default Appointment Duration</S.FieldLabel>
          <Select
            value={settings?.defaultDurationMinutes || 30}
            onChange={(val) => updateSetting("defaultDurationMinutes", val)}
            style={{ width: "100%" }}
            size="small"
          >
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
            loading={saving || isSaving}
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