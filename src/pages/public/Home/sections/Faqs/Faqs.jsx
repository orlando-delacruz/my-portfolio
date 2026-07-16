// ================================================================
// FILE: src/pages/public/Home/sections/Faqs/Faqs.jsx
// ================================================================

import { memo, useEffect, useRef } from "react";
import { Alert } from "antd";

import SectionTitle from "../../../../../components/common/SectionTitle";
import FaqAccordion from "../../../../../components/ui/Accordion/FaqAccordion";
import FaqForm from "../../../../../components/ui/Form/FaqForm";
import Loading from "../../../../../components/common/Loading";
import { useFaqs } from "../../../../../hooks/cms/useFaqs";
import * as S from "./Faqs.styled";

const Faqs = () => {
  const { data: section, isLoading, error, refetch } = useFaqs();
  const hasRefetched = useRef(false);

  // Force a refetch on mount to ensure fresh data
  useEffect(() => {
    if (!hasRefetched.current) {
      hasRefetched.current = true;
      refetch();
    }
  }, [refetch]);

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

  const { pre_title, title, highlight_text, form_image, items = [] } = section;

  const faqItems = items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  // Use the image URL as the key – it changes when the image updates
  const formKey = form_image || "default";

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
          <FaqForm key={formKey} imageSrc={form_image} />
        </S.SectionInner>
      )}
    </S.Section>
  );
};

export default memo(Faqs);