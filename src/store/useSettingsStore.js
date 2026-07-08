// src/store/useSettingsStore.js
import { create } from "zustand";
import { fetchSettings, updateSettings, uploadLogo } from "../services/settings";
import { fetchOperatingHours, updateOperatingHours } from "../services/operatingHours";
import { fetchActiveBranches } from "../services/branches";
import { fetchServices, createService, updateService, deleteService } from "../services/services";
import { supabase } from "../services/supabase/supabase";

const useSettingsStore = create((set, get) => ({
  // ── State ──
  loading: false,
  error: null,
  isSaving: false,

  clinicInfo: null,
  operatingHours: {},
  branches: [],
  profile: null,
  googleLogin: { connected: false, email: null },
  appointmentSettings: null,
  notifications: null,

  services: {}, // keyed by branchId
  loadingServices: false,
  savingService: false,

  // ── Actions ──

  fetchSettings: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      const settings = await fetchSettings();
      const branches = await fetchActiveBranches();
      const hoursMap = {};
      for (const branch of branches) {
        try {
          const hours = await fetchOperatingHours(branch.id);
          hoursMap[branch.id] = hours;
        } catch (err) {
          console.warn(`Failed to fetch hours for branch ${branch.id}:`, err);
          hoursMap[branch.id] = [
            { id: null, dayOfWeek: 0, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 1, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 2, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 3, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 4, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 5, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
            { id: null, dayOfWeek: 6, openTime: null, closeTime: null, breakStartTime: null, breakEndTime: null, isClosed: true, branchId: branch.id },
          ];
        }
      }

      const servicesMap = {};
      for (const branch of branches) {
        try {
          const services = await fetchServices(branch.id);
          servicesMap[branch.id] = services;
        } catch (err) {
          console.warn(`Failed to fetch services for branch ${branch.id}:`, err);
          servicesMap[branch.id] = [];
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      let profile = null;
      if (user) {
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("auth_user_id", user.id)
          .single();
        profile = adminData;
      }
      const googleConnected = user?.app_metadata?.provider === "google" || false;

      set({
        clinicInfo: {
          name: settings.clinic_name || "",
          email: settings.email || "",
          phone: settings.phone || "",
          website: settings.website || "",
          logoUrl: settings.logo_url || null,
        },
        branches,
        operatingHours: hoursMap,
        services: servicesMap,
        profile: profile ? {
          id: profile.id,
          fullName: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone_number || "",
          avatarUrl: profile.avatar_url || null,
          role: profile.role || "staff",
          username: profile.username || "",
        } : null,
        googleLogin: { connected: googleConnected, email: user?.email || null },
        appointmentSettings: {
          intervalMinutes: settings.appointment_interval_minutes || 30,
          advanceBookingDays: settings.advance_booking_days || 60,
          cancellationHours: settings.cancellation_hours || 24,
          defaultDurationMinutes: settings.default_appointment_duration || 30,
        },
        notifications: {
          email: settings.email_notifications_enabled !== false,
          sms: settings.sms_notifications_enabled !== false,
          reminders: settings.reminder_minutes ? settings.reminder_minutes > 0 : true,
          marketing: settings.marketing_notifications_enabled === true,
        },
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
      set({ loading: false, error: err.message || "Failed to load settings. Please try again." });
    }
  },

  // ── Clinic Information ──
  updateClinicInfo: async (values) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await updateSettings({
        clinic_name: values.name,
        email: values.email,
        phone: values.phone,
        website: values.website,
      });
      set((state) => ({
        clinicInfo: {
          ...state.clinicInfo,
          name: updated.clinic_name,
          email: updated.email,
          phone: updated.phone,
          website: updated.website,
        },
        isSaving: false,
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update clinic information" });
      throw err;
    }
  },

  // ── Profile ──
  updateProfile: async (values) => {
    const state = get();
    if (!state.profile?.id) throw new Error("No profile found");
    set({ isSaving: true, error: null });
    try {
      const { data, error } = await supabase
        .from("admins")
        .update({
          full_name: values.fullName,
          email: values.email,
          phone_number: values.phone,
          avatar_url: values.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", state.profile.id)
        .select()
        .single();
      if (error) throw error;
      set((state) => ({
        profile: {
          ...state.profile,
          fullName: data.full_name,
          email: data.email,
          phone: data.phone_number,
          avatarUrl: data.avatar_url,
        },
        isSaving: false,
      }));
      if (values.email && values.email !== state.profile.email) {
        await supabase.auth.updateUser({ email: values.email });
      }
      return data;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update profile" });
      throw err;
    }
  },

  uploadAvatar: async (file) => {
    const state = get();
    if (!state.profile?.id) throw new Error("No profile found");
    set({ isSaving: true, error: null });
    try {
      const { uploadAvatar } = await import("../services/storage");
      const avatarUrl = await uploadAvatar(file, state.profile.id);
      const { data, error } = await supabase
        .from("admins")
        .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
        .eq("id", state.profile.id)
        .select()
        .single();
      if (error) throw error;
      set((state) => ({
        profile: { ...state.profile, avatarUrl: data.avatar_url },
        isSaving: false,
      }));
      return avatarUrl;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to upload avatar" });
      throw err;
    }
  },

  toggleGoogleLogin: () => {
    set((state) => ({
      googleLogin: {
        ...state.googleLogin,
        connected: !state.googleLogin.connected,
      },
    }));
  },

  // ── Branches ──
  addBranch: async (branch) => {
    set({ isSaving: true, error: null });
    try {
      const { data, error } = await supabase
        .from("branches")
        .insert({
          name: branch.name,
          address: branch.address,
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      try {
        const { seedOperatingHours } = await import("../services/operatingHours");
        await seedOperatingHours(data.id);
      } catch (seedErr) {
        console.warn("Failed to seed operating hours:", seedErr);
      }
      set((state) => ({
        branches: [...state.branches, data],
        isSaving: false,
      }));
      return data;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to add branch" });
      throw err;
    }
  },

  updateBranch: async (id, updates) => {
    set({ isSaving: true, error: null });
    try {
      const { data, error } = await supabase
        .from("branches")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      set((state) => ({
        branches: state.branches.map((b) => (b.id === id ? data : b)),
        isSaving: false,
      }));
      return data;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update branch" });
      throw err;
    }
  },

  deleteBranch: async (id) => {
    set({ isSaving: true, error: null });
    try {
      const { error: hoursError } = await supabase
        .from("operating_hours")
        .delete()
        .eq("branch_id", id);
      if (hoursError) console.warn("Failed to delete operating hours:", hoursError);
      const { error } = await supabase.from("branches").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({
        branches: state.branches.filter((b) => b.id !== id),
        isSaving: false,
      }));
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to delete branch" });
      throw err;
    }
  },

  // ── Operating Hours ──
  updateBranchHours: async (branchId, hours) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await updateOperatingHours(branchId, hours);
      set((state) => ({
        operatingHours: {
          ...state.operatingHours,
          [branchId]: updated,
        },
        isSaving: false,
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update operating hours" });
      throw err;
    }
  },

  updateOperatingHoursLocal: (branchId, dayIndex, field, value) =>
    set((state) => {
      const hours = { ...state.operatingHours };
      const branchHours = [...(hours[branchId] || [])];
      branchHours[dayIndex] = { ...branchHours[dayIndex], [field]: value };
      hours[branchId] = branchHours;
      return { operatingHours: hours };
    }),

  // ── Services ──
  fetchBranchServices: async (branchId) => {
    if (!branchId) return;
    set({ loadingServices: true });
    try {
      const data = await fetchServices(branchId);
      set((state) => ({
        services: {
          ...state.services,
          [branchId]: data,
        },
        loadingServices: false,
      }));
    } catch (err) {
      console.error("Error fetching services:", err);
      set({ loadingServices: false, error: err.message });
    }
  },

  createService: async (serviceData) => {
    set({ savingService: true, error: null });
    try {
      const newService = await createService(serviceData);
      const branchId = serviceData.branch_id;
      set((state) => ({
        services: {
          ...state.services,
          [branchId]: [...(state.services[branchId] || []), newService],
        },
        savingService: false,
      }));
      return newService;
    } catch (err) {
      set({ savingService: false, error: err.message });
      throw err;
    }
  },

  updateService: async (serviceId, updates) => {
    set({ savingService: true, error: null });
    try {
      const updated = await updateService(serviceId, updates);
      const state = get();
      let branchId = null;
      for (const [bId, services] of Object.entries(state.services)) {
        if (services.some((s) => s.id === serviceId)) {
          branchId = bId;
          break;
        }
      }
      if (branchId) {
        set((state) => ({
          services: {
            ...state.services,
            [branchId]: state.services[branchId].map((s) =>
              s.id === serviceId ? updated : s
            ),
          },
          savingService: false,
        }));
      } else {
        set({ savingService: false });
      }
      return updated;
    } catch (err) {
      set({ savingService: false, error: err.message });
      throw err;
    }
  },

  deleteService: async (serviceId) => {
    set({ savingService: true, error: null });
    try {
      await deleteService(serviceId);
      const state = get();
      let branchId = null;
      for (const [bId, services] of Object.entries(state.services)) {
        if (services.some((s) => s.id === serviceId)) {
          branchId = bId;
          break;
        }
      }
      if (branchId) {
        set((state) => ({
          services: {
            ...state.services,
            [branchId]: state.services[branchId].filter((s) => s.id !== serviceId),
          },
          savingService: false,
        }));
      } else {
        set({ savingService: false });
      }
    } catch (err) {
      set({ savingService: false, error: err.message });
      throw err;
    }
  },

  // ── Appointment Settings ──
  updateAppointmentSettings: async (values) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await updateSettings({
        appointment_interval_minutes: values.intervalMinutes,
        advance_booking_days: values.advanceBookingDays,
        cancellation_hours: values.cancellationHours,
        default_appointment_duration: values.defaultDurationMinutes,
      });
      set((state) => ({
        appointmentSettings: {
          ...state.appointmentSettings,
          intervalMinutes: updated.appointment_interval_minutes,
          advanceBookingDays: updated.advance_booking_days,
          cancellationHours: updated.cancellation_hours,
          defaultDurationMinutes: updated.default_appointment_duration,
        },
        isSaving: false,
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update appointment settings" });
      throw err;
    }
  },

  updateAppointmentSetting: (field, value) =>
    set((state) => ({
      appointmentSettings: {
        ...state.appointmentSettings,
        [field]: value,
      },
    })),

  // ── Notifications ──
  updateNotifications: async (values) => {
    set({ isSaving: true, error: null });
    try {
      const dbUpdates = {
        email_notifications_enabled: values.email !== undefined ? values.email : true,
        sms_notifications_enabled: values.sms !== undefined ? values.sms : true,
        marketing_notifications_enabled: values.marketing || false,
        reminder_minutes: values.reminders ? 60 : 0,
      };
      const updated = await updateSettings(dbUpdates);
      set((state) => ({
        notifications: {
          email: updated.email_notifications_enabled !== false,
          sms: updated.sms_notifications_enabled !== false,
          reminders: updated.reminder_minutes ? updated.reminder_minutes > 0 : true,
          marketing: updated.marketing_notifications_enabled === true,
        },
        isSaving: false,
      }));
      return updated;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to update notification preferences" });
      throw err;
    }
  },

  toggleNotification: (key) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [key]: !state.notifications[key],
      },
    })),

  // ── Logo Upload ──
  uploadLogo: async (file) => {
    const state = get();
    set({ isSaving: true, error: null });
    try {
      const oldLogoUrl = state.clinicInfo?.logoUrl || null;
      const logoUrl = await uploadLogo(file, oldLogoUrl);
      await updateSettings({ logo_url: logoUrl });
      set((state) => ({
        clinicInfo: { ...state.clinicInfo, logoUrl },
        isSaving: false,
      }));
      return logoUrl;
    } catch (err) {
      set({ isSaving: false, error: err.message || "Failed to upload logo" });
      throw err;
    }
  },

  reset: () => {
    set({
      loading: false,
      error: null,
      isSaving: false,
      clinicInfo: null,
      operatingHours: {},
      branches: [],
      profile: null,
      googleLogin: { connected: false, email: null },
      appointmentSettings: null,
      notifications: null,
      services: {},
      loadingServices: false,
      savingService: false,
    });
  },
}));

export default useSettingsStore;