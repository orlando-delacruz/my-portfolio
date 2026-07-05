// src/components/ui/Accordion/FaqAccordion/FaqAccordion.jsx
import { memo } from "react";
import { Collapse } from "antd";
import { FiPlus, FiMinus } from "react-icons/fi";
import * as S from "./FaqAccordion.styled";

const FaqAccordion = memo(({ items }) => {
  const collapseItems = items.map(({ id, question, answer }) => ({
    key: id,
    label: <S.QuestionText>{question}</S.QuestionText>,
    children: <S.AnswerText>{answer}</S.AnswerText>,
  }));

  return (
    <S.AccordionWrapper>
      <Collapse
        accordion
        ghost
        expandIconPlacement="end" // ✅ fixed
        expandIcon={({ isActive }) =>
          isActive ? (
            <S.IconWrap aria-hidden="true">
              <FiMinus />
            </S.IconWrap>
          ) : (
            <S.IconWrap aria-hidden="true">
              <FiPlus />
            </S.IconWrap>
          )
        }
        items={collapseItems}
      />
    </S.AccordionWrapper>
  );
});

FaqAccordion.displayName = "FaqAccordion";
export default FaqAccordion;