// src/utils/conflictMessage.js

/**
 * Generate a user-friendly conflict message based on the conflict details.
 * @param {Object} result - The result from checkBookingConflictWithDetails
 * @returns {string} The user-friendly message
 */
export function generateConflictMessage(result) {
  if (!result || !result.hasConflict) {
    return "";
  }

  const conflictTime = result.conflictTime || "the existing appointment";
  let message = `The selected time conflicts with a confirmed appointment at ${conflictTime}. `;

  const hasBefore =
    result.previousAvailableTime !== null &&
    result.previousAvailableTime !== undefined;
  const hasAfter =
    result.nextAvailableTime !== null && result.nextAvailableTime !== undefined;

  if (hasBefore && hasAfter) {
    message += `You may book any available time before ${result.previousAvailableTime} or from ${result.nextAvailableTime} onwards.`;
  } else if (hasAfter) {
    message += `The earliest available appointment is ${result.nextAvailableTime}.`;
  } else if (hasBefore) {
    message += `You may book any available time before ${result.previousAvailableTime}.`;
  } else {
    message += `Please choose a time at least 60 minutes before or after the conflicting appointment.`;
  }

  return message;
}
