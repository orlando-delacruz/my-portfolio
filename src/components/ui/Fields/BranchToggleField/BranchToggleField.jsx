// src/components/ui/Fields/BranchToggleField/BranchToggleField.jsx
import { memo } from "react";
import * as S from "./BranchToggleField.styled";

/**
 * BranchToggleField
 * @param {string}   id
 * @param {string}   label
 * @param {Array}    options   - [{ value, label }]
 * @param {string}   value     - currently selected value
 * @param {function} onChange  - (value: string) => void
 * @param {string}   error
 * @param {boolean}  required
 */
const BranchToggleField = memo(({ id, label, options, value, onChange, error, required = false }) => (
  <S.FieldWrapper>
    <S.Label id={`${id}-label`}>
      {label}
      {required && <S.Required aria-hidden="true"> *</S.Required>}
    </S.Label>
    <S.ToggleGroup
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      aria-required={required}
    >
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <S.ToggleButton
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            $active={checked}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </S.ToggleButton>
        );
      })}
    </S.ToggleGroup>
    {error && (
      <S.ErrorMsg id={`${id}-error`} role="alert">
        {error}
      </S.ErrorMsg>
    )}
  </S.FieldWrapper>
));

BranchToggleField.displayName = "BranchToggleField";
export default BranchToggleField;