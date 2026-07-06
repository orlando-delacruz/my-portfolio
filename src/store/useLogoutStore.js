// src/store/useLogoutStore.js
import { create } from "zustand";

export const useLogoutStore = create((set) => ({
  isOpen: false,
  openLogoutModal: () => set({ isOpen: true }),
  closeLogoutModal: () => set({ isOpen: false }),
}));