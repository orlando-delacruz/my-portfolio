// src/components/ui/Button/Button.jsx
import { StyledButton } from "./Button.styled";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </StyledButton>
  );
}