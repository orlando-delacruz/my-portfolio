import styled from "styled-components";
import theme from "../../../../styles/theme";

export const AccordionWrapper = styled.div`
  width: 100%;
 
  /* ── Override Ant Design Collapse styles ─────────────────────────── */
 
  .ant-collapse {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
 
  .ant-collapse-item {
    background: ${theme.colors.white};
    border-radius: 50px !important;
    border: 1px solid ${theme.colors.primary} !important;
    box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    transition: border-radius 0.25s ease;
  }
 
  /* When open, flatten bottom corners so the answer panel looks connected */
  .ant-collapse-item-active {
    border-radius: 24px !important;
  }
 
  .ant-collapse-header {
    padding: 12px 12px 12px 30px !important;
    align-items: center !important;
    min-height: 60px;
  }
 
  .ant-collapse-header-text {
    flex: 1;
  }
 
  .ant-collapse-expand-icon {
    display: flex;
    align-items: center;
    padding: 0 !important;
    margin: 0 !important;
  }
 
  .ant-collapse-content {
    border-top: none !important;
    background: ${theme.colors.white} !important;
  }
 
  .ant-collapse-content-box {
    padding: 0 30px 20px !important;
  }
`;

export const QuestionText = styled.span`
  font-size: 18px;
  font-weight: ${theme.typography.weight.medium};
  color: ${theme.colors.black};
  line-height: 1.5;
`;

export const AnswerText = styled.p`
  font-size: ${theme.typography.size.body};
  font-weight: ${theme.typography.weight.regular};
  color: ${theme.colors.black};
  line-height: 1.7;
  opacity: 0.8;
`;

export const IconWrap = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${theme.colors.primary};
  color: ${theme.colors.white} !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;
