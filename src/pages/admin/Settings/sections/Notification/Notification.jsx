// src/pages/admin/Settings/sections/Notification/Notification.jsx
import { memo, useState, useCallback } from "react";
import { Button, message, Skeleton } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { SETTINGS_SECTION_ICONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import ToggleSwitch from "../../../../../components/admin/Settings/ToggleSwitch";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./Notification.styled";

const Notification = () => {
  const icon = SETTINGS_SECTION_ICONS.notification;
  const [saving, setSaving] = useState(false);

  const notifications = useSettingsStore((state) => state.notifications);
  const loading = useSettingsStore((state) => state.loading);
  const updateNotifications = useSettingsStore((state) => state.updateNotifications);
  const isSaving = useSettingsStore((state) => state.isSaving);

  // Local toggle (optimistic)
  const toggleNotification = useSettingsStore((state) => state.toggleNotification);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await updateNotifications(notifications);
      message.success("Notification preferences saved successfully!");
    } catch (err) {
      message.error(err?.message || "Failed to save preferences.");
    } finally {
      setSaving(false);
    }
  }, [notifications, updateNotifications]);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="Notification" subtitle="Manage your notification preferences">
        <S.Container>
          <Skeleton active paragraph={{ rows: 4 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="Notification" subtitle="Manage your notification preferences">
      <S.Container>
        <ToggleSwitch
          checked={notifications?.email !== false}
          onChange={() => toggleNotification("email")}
          label="Email Notification"
          description="Receive email notifications for appointments and updates"
        />

        <ToggleSwitch
          checked={notifications?.sms !== false}
          onChange={() => toggleNotification("sms")}
          label="SMS Notification"
          description="Receive SMS reminders for appointments and updates"
        />

        <ToggleSwitch
          checked={notifications?.reminders !== false}
          onChange={() => toggleNotification("reminders")}
          label="Appointment Reminders"
          description="Receive reminders before appointments"
        />

        <ToggleSwitch
          checked={notifications?.marketing === true}
          onChange={() => toggleNotification("marketing")}
          label="Marketing Updates"
          description="Receive updates about offers and promotions"
        />

        <S.ActionRow>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving || isSaving}
            style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}
          >
            Save Preferences
          </Button>
        </S.ActionRow>
      </S.Container>
    </SettingsCard>
  );
};

export default memo(Notification);