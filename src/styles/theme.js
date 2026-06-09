// src/styles/theme.js
const theme = {
  colors: {
    primary: "#886217",
    primaryLight: "#886217",
    primaryDark: "#654405",
    secondary: "#F5E6C8",

    gray: "#eeeeee",

    background: "#FFFFFF",
    sectionBackground: "##FFFFFF",

    white: "#ffffff",
    black: "#222222",

    overlay: "rgba(0, 0, 0, 0.5)",

    danger: "#dc2626",
    dangerDark: "#b91c1c",

    sucess: "#16a34a",
    successDark: "#15803d",


  },

  typography: {
    font: {
      main: '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      secondary: "sans-serif",
    },


    heading: {
      h1: "clamp(2.25rem, 6vw, 3.438rem)",
      h2: "clamp(1.625rem, 5vw, 2.5rem)",
      h3: "clamp(1.25rem, 4vw, 1.875rem)",
      h4: "clamp(1rem, 3vw, 24px)",
      h5: "clamp(1.25rem, 3vw, 1rem)",
      h6: "clamp(1.125rem, 3vw, 1rem)"
    },

    size: {
      xs: "12px",
      sm: "14px",
      body: "16px",
      md: "18px",
      lg: "clamp(1.25rem, 3vw, 1rem)",
      xl: "30px",
      xxl: "clamp(1.5rem ,5vw, 2.188rem)"
    },

    weight: {
      regular: "400",
      medium: "500",
      semibold: "600",
    }
  },

  media: {
    mobile: "(max-width: 576px)",
    tablet: "(max-width: 1024px)",
    laptop: "(max-width: 1280px)",
    desktop: "(min-width: 1440px)"
  }
}

export default theme