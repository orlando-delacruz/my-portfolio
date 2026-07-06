// src/pages/admin/Settings/sections/OperatingHours/OperatingHours.jsx
import { memo, useState, useCallback, useMemo } from "react";
import { Button, message, Skeleton } from "antd";
import { SETTINGS_SECTION_ICONS } from "../../../../../data/admin/settings";
import SettingsCard from "../../../../../components/admin/Settings/SettingsCard";
import BranchTabs from "./BranchTabs";
import TimeTable from "./TimeTable";
import useSettingsStore from "../../../../../store/useSettingsStore";
import * as S from "./OperatingHours.styled";

const OperatingHours = () => {
  const icon = SETTINGS_SECTION_ICONS.operatingHours;

  const branches = useSettingsStore((state) => state.branches);
  const loading = useSettingsStore((state) => state.loading);
  const operatingHours = useSettingsStore((state) => state.operatingHours);
  const updateBranchHours = useSettingsStore((state) => state.updateBranchHours);
  const isSaving = useSettingsStore((state) => state.isSaving);

  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [saving, setSaving] = useState(false);

  const activeBranch = useMemo(() => {
    if (!branches || branches.length === 0) return null;
    if (selectedBranchId && branches.some((b) => b.id === selectedBranchId)) {
      return selectedBranchId;
    }
    return branches[0].id;
  }, [branches, selectedBranchId]);

  const currentBranchHours = useMemo(() => {
    if (!activeBranch) return [];
    return operatingHours[activeBranch] || [];
  }, [operatingHours, activeBranch]);

  const handleBranchChange = useCallback((branchId) => {
    setSelectedBranchId(branchId);
  }, []);

  const handleSave = useCallback(async () => {
    if (!activeBranch) return;
    setSaving(true);
    try {
      await updateBranchHours(activeBranch, currentBranchHours);
      message.success("Operating hours saved successfully!");
    } catch (err) {
      message.error(err?.message || "Failed to save operating hours.");
    } finally {
      setSaving(false);
    }
  }, [activeBranch, currentBranchHours, updateBranchHours]);

  const handleUpdateHour = useCallback((branchId, dayIndex, field, value) => {
    const updateLocal = useSettingsStore.getState().updateOperatingHoursLocal;
    updateLocal(branchId, dayIndex, field, value);
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

  if (branches.length === 0) {
    return (
      <SettingsCard icon={icon} title="Operating Hours" subtitle="Set your clinic's operating hours for each branch">
        <S.Container>
          <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
            No branches found. Please add a branch first.
          </div>
        </S.Container>
      </SettingsCard>
    );
  }

  return (
    <SettingsCard icon={icon} title="Operating Hours" subtitle="Set your clinic's operating hours for each branch">
      <S.Container>
        <BranchTabs
          branches={branches}
          activeBranch={activeBranch}
          onBranchChange={handleBranchChange}
        />
        <TimeTable
          branchId={activeBranch}
          hours={currentBranchHours}
          onUpdateHour={handleUpdateHour}
        />
        <S.Footer>
          <Button
            type="primary"
            onClick={handleSave}
            loading={saving || isSaving}
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