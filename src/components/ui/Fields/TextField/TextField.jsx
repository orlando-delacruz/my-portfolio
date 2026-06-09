// src/components/ui/Fields/TextField/TextField.jsx
import { memo } from "react";
import * as S from "./TextField.styled";

/**
 * TextField
 * @param {string}   id
 * @param {string}   label
 * @param {string}   name
 * @param {string}   type        - "text" | "email" | "tel"
 * @param {string}   placeholder
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   error
 * @param {boolean}  required
 */
const TextField = memo(
  ({ id, label, name, type = "text", placeholder, value, onChange, error, required = false }) => (
    <S.FieldWrapper>
      <S.Label htmlFor={id}>
        {label}
        {required && <S.Required aria-hidden="true"> *</S.Required>}
      </S.Label>
      <S.Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        $hasError={!!error}
        autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "off"}
      />
      {error && (
        <S.ErrorMsg id={`${id}-error`} role="alert">
          {error}
        </S.ErrorMsg>
      )}
    </S.FieldWrapper>
  )
);

TextField.displayName = "TextField";
export default TextField;