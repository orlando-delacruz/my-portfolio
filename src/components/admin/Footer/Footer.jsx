// src/components/admin/Footer/Footer.jsx
import { memo } from "react";
import * as S from "./Footer.styled";

const Footer = () => (
  <S.FooterBar role="contentinfo">
    © {new Date().getFullYear()} Leidi Buds Clinic. All rights reserved.
  </S.FooterBar>
);

export default memo(Footer);