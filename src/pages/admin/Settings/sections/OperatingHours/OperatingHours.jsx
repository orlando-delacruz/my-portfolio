// src/pages/admin/Settings/sections/OperatingHours/OperatingHours.jsx
import { memo, useState, useCallback } from "react";
import { Button, message, Skeleton } from "antd";
import { SETTINGS_SECTION_ICONS, BRANCH_OPTIONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import BranchTabs from "./BranchTabs";
import TimeTable from "./TimeTable";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./OperatingHours.styled";

const OperatingHours = () => {
  const icon = SETTINGS_SECTION_ICONS.operatingHours;
  const [activeBranch, setActiveBranch] = useState(BRANCH_OPTIONS[0].id);
  const [saving, setSaving] = useState(false);

  // ✅ Individual selectors - stable references
  const operatingHours = useSettingsStore((state) => state.operatingHours);
  const loading = useSettingsStore((state) => state.loading);
  const updateOperatingHours = useSettingsStore((state) => state.updateOperatingHours);

  const currentBranchHours = operatingHours[activeBranch] || [];

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success("Operating hours saved successfully!");
    } catch {
      message.error("Failed to save operating hours.");
    } finally {
      setSaving(false);
    }
  }, []);

  if (loading) {
    return (
      <SettingsCard icon={icon} title="Operating Hours" subtitle="Set your clinic's operating hours for each branch">
        <S.Container>
          <Skeleton active paragraph={{ rows: 6 }} />
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="Operating Hours" subtitle="Set your clinic's operating hours for each branch">
      <S.Container>
        <BranchTabs activeBranch={activeBranch} onBranchChange={setActiveBranch} />
        <TimeTable
          branchId={activeBranch}
          hours={currentBranchHours}
          onUpdateHour={updateOperatingHours}
        />
        <S.Footer>
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving}
            style={{ background: "#886217", borderColor: "#886217", borderRadius: "5px" }}
          >
            Save Hours
          </Button>
        </S.Footer>
      </S.Container>
    </SettingsCard>
  );
};

export default memo(OperatingHours);