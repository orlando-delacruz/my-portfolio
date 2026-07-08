// src/hooks/usePhoneInput.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { getRawPhoneDigits, formatPhoneDisplay } from '../utils/phoneFormatter';

/**
 * Custom hook for managing Philippine mobile number input with automatic formatting.
 * @param {string} initialValue - Initial raw digits (e.g., "09123456789").
 * @param {function} onChange - Optional callback when raw value changes.
 * @returns {Object} { displayValue, rawValue, setRawValue, handleInputChange, inputProps }
 */
export function usePhoneInput(initialValue = '', onChange = null) {
  const [rawValue, setRawValue] = useState(() => getRawPhoneDigits(initialValue));
  const rawValueRef = useRef(rawValue);
  const displayValue = formatPhoneDisplay(rawValue);
  const inputRef = useRef(null);

  // Update raw value if initialValue changes externally
  useEffect(() => {
    const cleaned = getRawPhoneDigits(initialValue);
    if (cleaned !== rawValueRef.current) {
      rawValueRef.current = cleaned;
      setRawValue(cleaned);
    }
  }, [initialValue]);

  const handleInputChange = useCallback(
    (e) => {
      const raw = getRawPhoneDigits(e.target.value);
      // Allow only digits and limit to 11 digits
      const digitsOnly = raw.slice(0, 11);
      rawValueRef.current = digitsOnly;
      setRawValue(digitsOnly);
      if (onChange) onChange(digitsOnly);
    },
    [onChange]
  );

  // Handle paste event to clean up formatting
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text/plain');
    const digits = getRawPhoneDigits(pasted).slice(0, 11);
    if (digits) {
      rawValueRef.current = digits;
      setRawValue(digits);
      if (onChange) onChange(digits);
    }
  }, [onChange]);

  return {
    displayValue,
    rawValue,
    setRawValue,
    handleInputChange,
    handlePaste,
    inputRef,
    inputProps: {
      value: displayValue,
      onChange: handleInputChange,
      onPaste: handlePaste,
      maxLength: 14, // 11 digits + 2 spaces
      ref: inputRef,
    },
  };
}