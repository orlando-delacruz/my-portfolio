// src/utils/phoneFormatter.js

/**
 * Format a Philippine mobile number with spaces: 0912 345 6789
 * @param {string} digits - raw digits (e.g., "09123456789")
 * @returns {string} formatted string
 */
export function formatPhoneDisplay(digits) {
  if (!digits) return "";
  const raw = digits.replace(/\D/g, "");
  if (raw.length > 7) {
    return raw.slice(0, 4) + " " + raw.slice(4, 7) + " " + raw.slice(7);
  }
  if (raw.length > 4) {
    return raw.slice(0, 4) + " " + raw.slice(4);
  }
  return raw;
}

/**
 * Validate Philippine mobile number
 * @param {string} value - the raw digits (without spaces)
 * @returns {boolean} true if valid
 */
export function isValidPhilippinePhone(value) {
  if (!value) return false;
  const stripped = value.replace(/\s/g, "");
  return /^(\+63|0)\d{10}$/.test(stripped);
}

/**
 * Get raw digits from formatted or unformatted string
 * @param {string} value
 * @returns {string} digits only
 */
export function getRawPhoneDigits(value) {
  return value.replace(/\D/g, "");
}
