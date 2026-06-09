// src/components/ui/Fields/SelectField/SelectField.jsx
import { memo } from "react";
import { FiChevronDown } from "react-icons/fi";
import * as S from "./SelectField.styled";

/**
 * SelectField
 * @param {string}   id
 * @param {string}   label
 * @param {string}   name
 * @param {Array}    options     - [{ value, label }]
 * @param {string}   value
 * @param {function} onChange
 * @param {string}   placeholder
 * @param {string}   error
 * @param {boolean}  required
 */
const SelectField = memo(
  ({ id, label, name, options, value, onChange, placeholder = "Select", error, required = false }) => (
    <S.FieldWrapper>
      <S.Label htmlFor={id}>
        {label}
        {required && <S.Required aria-hidden="true"> *</S.Required>}
      </S.Label>
      <S.SelectWrapper>
        <S.Select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          $hasError={!!error}
          $empty={!value}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map(({ value: val, label: lbl }) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </S.Select>
        <S.ChevronIcon aria-hidden="true">
          <FiChevronDown />
        </S.ChevronIcon>
      </S.SelectWrapper>
      {error && (
        <S.ErrorMsg id={`${id}-error`} role="alert">
          {error}
        </S.ErrorMsg>
      )}
    </S.FieldWrapper>
  )
);

SelectField.displayName = "SelectField";
export default SelectField;