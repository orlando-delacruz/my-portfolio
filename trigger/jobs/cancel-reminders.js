// trigger/jobs/cancel-reminders.js
import { job } from "@trigger.dev/sdk";

export const cancelRemindersJob = job({
  id: "cancel-reminders",
  name: "Cancel reminders on appointment cancellation",
  version: "1.0.0",
  trigger: "event",
  event: "appointment.cancelled",
  run: async (payload) => {
    const { appointmentId } = payload;
    console.log(`🔇 Cancelling reminders for appointment ${appointmentId}`);

    // We rely on the reminder job's status check to skip cancelled appointments.
    // If we want to explicitly cancel scheduled jobs, we could store job IDs.
    // For now, the status check is sufficient.

    return { success: true };
  },
});
