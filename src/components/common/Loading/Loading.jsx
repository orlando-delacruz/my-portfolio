// src/components/common/Loading/Loading.jsx
import { memo } from 'react';
import * as S from './Loading.styled';

const Loading = memo(({ fullscreen = false, text = 'Loading...', size = 'medium' }) => {
  return (
    <S.Container $fullscreen={fullscreen} role="status" aria-live="polite">
      <S.Spinner $size={size} />
      {text && <S.LoadingText>{text}</S.LoadingText>}
    </S.Container>
  );
});

Loading.displayName = 'Loading';
export default Loading;