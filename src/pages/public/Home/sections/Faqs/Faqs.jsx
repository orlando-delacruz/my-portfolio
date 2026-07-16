// src/pages/public/Home/sections/Faqs/Faqs.jsx
import { memo } from "react";
import { Alert } from "antd";

import SectionTitle from "../../../../../components/common/SectionTitle";
import FaqAccordion from "../../../../../components/ui/Accordion/FaqAccordion";
import FaqForm from "../../../../../components/ui/Form/FaqForm";
import Loading from "../../../../../components/common/Loading";
import { useFaqs } from "../../../../../hooks/cms/useFaqs";
import * as S from "./Faqs.styled";

const Faqs = () => {
  const { data: section, isLoading, error } = useFaqs();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (error || !section) {
    return (
      <S.Section id="faqs" aria-labelledby="faqs-heading">
        <Alert type="error" title="Failed to load FAQs" showIcon />
      </S.Section>
    );
  }

  const { pre_title, title, highlight_text, items = [] } = section;

  // Transform CMS items to the shape expected by FaqAccordion
  const faqItems = items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <S.Section id="faqs" aria-labelledby="faqs-heading">
      <SectionTitle
        eyebrow={pre_title}
        headingStart={title}
        headingAccent={highlight_text}
        id="faqs-heading"
      />

      {faqItems.length === 0 ? (
        <S.EmptyState>No FAQs available at the moment.</S.EmptyState>
      ) : (
        <S.SectionInner>
          <FaqAccordion items={faqItems} />
          <FaqForm />
        </S.SectionInner>
      )}
    </S.Section>
  );
};

export default memo(Faqs);