// src/components/common/SectionTitle/SectionTitle.jsx
import { memo } from "react";
import * as S from "./SectionTitle.styled";

/**
 * SectionTitle
 *
 * @param {string}  eyebrow
 * @param {string}  headingStart
 * @param {string}  headingAccent
 * @param {string}  id
 */
const SectionTitle = memo(({ eyebrow, headingStart, headingAccent, id }) => (
  <S.SectionTitleWrapper>
    {eyebrow && <S.Eyebrow>{eyebrow}</S.Eyebrow>}
    <S.Heading id={id}>
      {headingStart}
      {headingAccent && <span className="accent">{headingAccent}</span>}
    </S.Heading>
  </S.SectionTitleWrapper>
));

SectionTitle.displayName = "SectionTitle";
export default SectionTitle;