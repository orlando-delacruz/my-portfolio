// src/pages/admin/ClinicClosures/sections/PageTitle/PageTitle.jsx
import { memo } from 'react';
import { IoAddOutline } from 'react-icons/io5';
import Button from '../../../../../components/admin/Button/Button';
import * as S from './PageTitle.styled';

const PageTitle = ({ onAdd }) => (
  <S.Header>
    <S.TitleGroup>
      <S.Title>Clinic Closures</S.Title>
      <S.Subtitle>Manage clinic unavailable dates and notify your patients</S.Subtitle>
    </S.TitleGroup>
    <Button
      icon={<IoAddOutline size={24} color="#ffffff" />}
      label="Add Closure"
      variant="primary"
      onClick={onAdd}
      aria-label="Add new clinic closure"
    />
  </S.Header>
);

export default memo(PageTitle);