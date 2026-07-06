// src/pages/admin/Settings/Settings.jsx
import { memo, useEffect, useRef } from "react";
import { Alert, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/admin/AdminLayout";
import useSettingsStore from "../../../store/useSettingsStore";
import SettingsSkeleton from "./SettingsSkeleton";
import * as S from "./Settings.styled";

// ── Sections ──
import OperatingHours from "./sections/OperatingHours";
import ClinicInformation from "./sections/ClinicInformation";
import MyProfile from "./sections/MyProfile";
import BranchManagement from "./sections/BranchManagement";
import AppointmentSettings from "./sections/AppointmentSettings";
import ServiceManagement from "./sections/ServiceManagement";

const Settings = () => {
  const loading = useSettingsStore((state) => state.loading);
  const error = useSettingsStore((state) => state.error);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);
  const fetched = useRef(false);

  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetchSettings();
    }
  }, [fetchSettings]);

  const handleRetry = () => fetchSettings();

  return (
    <AdminLayout>
      <S.PageContainer>
        <S.PageHeader>
          <S.TitleWrapper>
            <S.PageTitle>Settings</S.PageTitle>
            <S.PageSubtitle>Manage your clinic preferences and system settings</S.PageSubtitle>
          </S.TitleWrapper>
        </S.PageHeader>

        {error && (
          <S.ErrorContainer>
            <Alert
              type="error"
              title="Failed to load settings"
              description={error}
              showIcon
              action={
                <Button size="small" icon={<ReloadOutlined />} onClick={handleRetry} style={{ marginTop: 4 }}>
                  Retry
                </Button>
              }
            />
          </S.ErrorContainer>
        )}

        {loading && !error && (
          <S.ContentGrid>
            <SettingsSkeleton />
          </S.ContentGrid>
        )}

        {!loading && !error && (
          <S.ContentGrid>
            <OperatingHours />
            <ClinicInformation />
            <MyProfile />
            <BranchManagement />
            <AppointmentSettings />
            <ServiceManagement />
          </S.ContentGrid>
        )}
      </S.PageContainer>
    </AdminLayout>
  );
};

export default memo(Settings);