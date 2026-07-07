// src/store/notificationStore.js
import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  isDropdownOpen: false,
  openDropdown: () => set({ isDropdownOpen: true }),
  closeDropdown: () => set({ isDropdownOpen: false }),
  toggleDropdown: () => set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
}));