// src/services/trigger.js
/*global process*/
import { TriggerClient } from "@trigger.dev/sdk";

const client = new TriggerClient({
  project: process.env.VITE_TRIGGER_PROJECT_ID,
  apiKey: process.env.VITE_TRIGGER_API_KEY,
});

export async function triggerConfirmation(appointmentId) {
  return await client.sendEvent({
    name: "appointment.created",
    payload: { appointmentId },
  });
}

export async function triggerCancellation(appointmentId) {
  return await client.sendEvent({
    name: "appointment.cancelled",
    payload: { appointmentId },
  });
}
