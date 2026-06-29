// src/store/useAdminStore.js
import { create } from "zustand";

const useAdminStore = create((set) => ({
  sidebarCollapsed: false,
  activeNav: "dashboard",

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setActiveNav: (key) => set({ activeNav: key }),
}));

export default useAdminStore;
