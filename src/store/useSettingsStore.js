// src/store/useSettingsStore.js
import { create } from "zustand";
import {
  MOCK_OPERATING_HOURS,
  MOCK_CLINIC_INFO,
  MOCK_PROFILE,
  MOCK_GOOGLE_LOGIN,
  MOCK_BRANCHES,
  MOCK_APPOINTMENT_SETTINGS,
  MOCK_NOTIFICATIONS,
} from "../data/admin/settings";

const useSettingsStore = create((set, get) => ({
  loading: false,
  error: null,

  operatingHours: MOCK_OPERATING_HOURS,
  updateOperatingHours: (branchId, dayIndex, field, value) =>
    set((state) => {
      const hours = { ...state.operatingHours };
      const branchHours = [...(hours[branchId] || [])];
      branchHours[dayIndex] = { ...branchHours[dayIndex], [field]: value };
      hours[branchId] = branchHours;
      return { operatingHours: hours };
    }),

  clinicInfo: MOCK_CLINIC_INFO,
  updateClinicInfo: (field, value) =>
    set((state) => ({
      clinicInfo: { ...state.clinicInfo, [field]: value },
    })),

  profile: MOCK_PROFILE,
  updateProfile: (field, value) =>
    set((state) => ({
      profile: { ...state.profile, [field]: value },
    })),

  googleLogin: MOCK_GOOGLE_LOGIN,
  toggleGoogleLogin: () =>
    set((state) => ({
      googleLogin: { ...state.googleLogin, connected: !state.googleLogin.connected },
    })),

  branches: MOCK_BRANCHES,
  addBranch: (branch) =>
    set((state) => ({
      branches: [...state.branches, { ...branch, id: `branch-${Date.now()}` }],
    })),
  updateBranch: (id, updates) =>
    set((state) => ({
      branches: state.branches.map((b) =>
        b.id === id ? { ...b, ...updates } : b
      ),
    })),
  deleteBranch: (id) =>
    set((state) => ({
      branches: state.branches.filter((b) => b.id !== id),
    })),

  appointmentSettings: MOCK_APPOINTMENT_SETTINGS,
  updateAppointmentSetting: (field, value) =>
    set((state) => ({
      appointmentSettings: { ...state.appointmentSettings, [field]: value },
    })),

  notifications: MOCK_NOTIFICATIONS,
  toggleNotification: (key) =>
    set((state) => ({
      notifications: { ...state.notifications, [key]: !state.notifications[key] },
    })),

  fetchSettings: async () => {
    // ✅ Prevent multiple simultaneous fetches
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      set({ loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.message || "Failed to load settings. Please try again.",
      });
    }
  },

  reset: () =>
    set({
      loading: false,
      error: null,
      operatingHours: MOCK_OPERATING_HOURS,
      clinicInfo: MOCK_CLINIC_INFO,
      profile: MOCK_PROFILE,
      googleLogin: MOCK_GOOGLE_LOGIN,
      branches: MOCK_BRANCHES,
      appointmentSettings: MOCK_APPOINTMENT_SETTINGS,
      notifications: MOCK_NOTIFICATIONS,
    }),
}));

export default useSettingsStore;