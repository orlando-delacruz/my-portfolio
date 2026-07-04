// trigger/trigger.config.js
/*global process*/
import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: process.env.TRIGGER_PROJECT_ID,
  apiKey: process.env.TRIGGER_API_KEY,
  logLevel: "log",
  retries: {
    enabled: true,
    maxAttempts: 5,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60000,
  },
});
