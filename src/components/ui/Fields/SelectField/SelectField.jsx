// src/components/ui/Fields/SelectField/SelectField.jsx
import { memo } from "react";
import { Select } from "antd";
import { FiChevronDown } from "react-icons/fi";
import * as S from "./SelectField.styled";

const { Option } = Select;

const SelectField = memo(
  ({
    id,
    label,
    name,
    options,
    value,
    onChange,
    placeholder = "Select",
    error,
    required = false,
    loading = false,
    disabled = false,
  }) => (
    <S.FieldWrapper>
      <S.Label htmlFor={id}>
        {label}
        {required && <S.Required aria-hidden="true"> *</S.Required>}
      </S.Label>
      <Select
        id={id}
        name={name}
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        loading={loading}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        status={error ? "error" : ""}
        getPopupContainer={(triggerNode) => triggerNode.parentNode || document.body}
        style={{ width: "100%" }}
        className="select-field-custom"
        suffixIcon={<FiChevronDown size={20} color="#886217" />}
        classNames={{
          popup: {
            root: "select-field-dropdown",
          },
        }}
        styles={{
          selector: {
            borderRadius: "50px",
            border: `1.5px solid ${error ? "#dc2626" : "#886217"}`,
            height: "44px",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            boxShadow: "none",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          },
        }}
      >
        {options.map(({ value: val, label: lbl }) => (
          <Option key={val} value={val}>
            {lbl}
          </Option>
        ))}
      </Select>
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