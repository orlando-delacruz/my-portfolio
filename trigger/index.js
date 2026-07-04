// trigger/index.js
import { confirmationJob } from "./jobs/confirmation.js";
import { reminderJob } from "./jobs/reminder.js";
import { cancelRemindersJob } from "./jobs/cancel-reminders.js";

export const jobs = [confirmationJob, reminderJob, cancelRemindersJob];
