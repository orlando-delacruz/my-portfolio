// src\store\useCalendarStore.js
import { create } from "zustand";
import dayjs from "dayjs";

/**
 * Centralises calendar navigation + filter state.
 * Keeps PageTitle, Filters, and ScheduleCalendar in sync without prop drilling.
 */
const useCalendarStore = create((set) => ({
  // ── Navigation ───────────────────────────────────────────────────
  currentMonth: dayjs().startOf("month"),

  // ── Filters ──────────────────────────────────────────────────────
  branchId: "", // "" = All Branches

  // ── Actions ──────────────────────────────────────────────────────
  goToToday: () => set({ currentMonth: dayjs().startOf("month") }),
  goToPrevMonth: () =>
    set((s) => ({ currentMonth: s.currentMonth.subtract(1, "month") })),
  goToNextMonth: () =>
    set((s) => ({ currentMonth: s.currentMonth.add(1, "month") })),
  setBranchId: (branchId) => set({ branchId }),
}));

export default useCalendarStore;
