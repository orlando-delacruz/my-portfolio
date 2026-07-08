// src/pages/admin/Settings/SettingsSkeleton.jsx
import { memo } from "react";
import { Skeleton } from "antd";
import * as S from "./SettingsSkeleton.styled";

const SettingsSkeleton = memo(() => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <S.Card key={i}>
          <S.Header>
            <S.HeaderText>
              <S.TitleSkeleton active />
              <S.SubtitleSkeleton active />
            </S.HeaderText>
          </S.Header>
          <S.Body>
            <Skeleton active paragraph={{ rows: 4 }} />
          </S.Body>
        </S.Card>
      ))}
    </>
  );
});

SettingsSkeleton.displayName = "SettingsSkeleton";
export default SettingsSkeleton;