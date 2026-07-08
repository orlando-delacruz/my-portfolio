// src/pages/NotFound/NotFound.jsx
import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './NotFound.styled';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = '404 | Page Not Found';
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <S.Container>
      <S.Card>
        <S.IllustrationWrapper>
          <S.Illustration>Error</S.Illustration>
        </S.IllustrationWrapper>

        <S.ErrorCode>404</S.ErrorCode>
        <S.Title>Page Not Found</S.Title>
        <S.Subtitle>
          The page you are looking for doesn&apos;t exist or may have been moved.
        </S.Subtitle>

        <S.ButtonRow>
          <S.PrimaryButton onClick={handleGoHome}>Go to Homepage</S.PrimaryButton>
          <S.SecondaryButton onClick={handleGoBack}>Go Back</S.SecondaryButton>
        </S.ButtonRow>
      </S.Card>
    </S.Container>
  );
};

export default memo(NotFound);