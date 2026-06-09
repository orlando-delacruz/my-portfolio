import { memo } from "react";

import SectionTitle from "../../../../../components/common/SectionTitle";
import FaqAccordion from "../../../../../components/ui/Accordion/FaqAccordion";
import FaqForm from "../../../../../components/ui/Form/FaqForm";
import { faqs, heading } from "../../../../../data/HomePage/faqs";
import * as S from "./Faqs.styled";

const Faqs = () => (
  <S.Section id="faqs" aria-labelledby={heading.headingId}>
    <SectionTitle
      eyebrow={heading.eyebrow}
      headingStart={heading.headingStart}
      headingAccent={heading.headingAccent}
      id={heading.headingId}
    />

    <S.SectionInner>
      <FaqAccordion items={faqs} />
      <FaqForm />
    </S.SectionInner>
  </S.Section>
);

export default memo(Faqs);