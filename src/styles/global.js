// src/styles/global.js
import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        &:focus-visible {
        outline: 2px solid ${theme.colors.primary};
        outline-offset: 4px;
        border-radius: 4px;
  }
    }
    
    body, html {
    font-family: ${theme.typography.font.main}, ${theme.typography.font.secondary};
    font-weight: ${theme.typography.weight.regular};
    background-color: ${theme.colors.background};
    color: ${theme.colors.white};
    line-height: 1.5;
    scroll-behavior: smooth;
    font-synthesis: none;
    font-display: swap;
    }

    body {
        max-width: 1440px;
        margin: 0 auto;
    }

    section {
        padding: 112px 65px 80px;

        @media ${theme.media.tablet} {
        padding: 80px 20px 50px;

        }

         @media ${theme.media.mobile} {
        padding: 50px 20px 50px;
        }
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-weight: ${theme.typography.weight.regular};
    }

    a {
        text-decoration: none;
        color: inherit;
    }

    ul {
        list-style: none;
    }

    button {
        font-family: inherit;
        cursor: pointer;
        background-color: transparent;
        color: inherit;
        border: none;
        font-size: ${theme.typography.size.lg};
    }

    /* Hide scrollbar for time picker dropdown */
.time-picker-no-scrollbar .ant-picker-time-panel-column {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.time-picker-no-scrollbar .ant-picker-time-panel-column::-webkit-scrollbar {
  display: none;
}

/* ─── Custom SelectField styles (matches DatePicker & TimePicker) ── */
.select-field-custom .ant-select-selector {
  border-radius: 50px !important;
  border: 1.5px solid #886217 !important;
  background: #ffffff !important;
  height: 44px !important;
  padding: 0 20px !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
  transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
}

.select-field-custom .ant-select-selector:hover,
.select-field-custom.ant-select-focused .ant-select-selector {
  border-color: #654405 !important;
  box-shadow: 0 0 0 3px rgba(136, 98, 23, 0.13) !important;
}

.select-field-custom .ant-select-selection-item {
  font-family: inherit !important;
  font-size: 16px !important;
  color: #222222 !important;
  line-height: 1.5 !important;
}

.select-field-custom .ant-select-selection-placeholder {
  font-family: inherit !important;
  font-size: 16px !important;
  color: #555555 !important;
}

.select-field-custom.ant-select-disabled .ant-select-selector {
  opacity: 0.5;
  cursor: not-allowed;
}

.select-field-custom .ant-select-arrow {
  color: #886217 !important;
  font-size: 20px !important;
  right: 16px !important;
}

.select-field-custom.ant-select-status-error .ant-select-selector {
  border-color: #dc2626 !important;
}

.select-field-custom.ant-select-status-error .ant-select-selector:hover,
.select-field-custom.ant-select-status-error .ant-select-selector:focus {
  border-color: #dc2626 !important;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.13) !important;
  
  /* Hide scrollbar for time picker dropdown */
.time-picker-no-scrollbar .ant-picker-time-panel-column {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.time-picker-no-scrollbar .ant-picker-time-panel-column::-webkit-scrollbar {
  display: none;
}
}

@media (max-width: 576px) {
  .ant-modal {
    max-width: 100% !important;
    margin: 8px !important;
    width: calc(100% - 16px) !important;
  }
  .ant-modal-content {
    border-radius: 16px !important;
  }
  .ant-modal-body {
    padding: 16px !important;
  }
}

/* Mobile modal responsiveness */
@media (max-width: 576px) {
  .ant-modal {
    max-width: 100% !important;
    margin: 8px !important;
    width: calc(100% - 16px) !important;
  }
  .ant-modal-content {
    border-radius: 16px !important;
  }
  .ant-modal-body {
    padding: 16px !important;
  }
}
`;
export default GlobalStyle;
