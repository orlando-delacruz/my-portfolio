// src/data/admin/sidebar.js
import {
  MdDashboard,
  MdCalendarToday,
  MdEventBusy,
  MdPeople,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { BsCalendar2Check } from "react-icons/bs";

export const sidebarNavItems = [
  { key: "dashboard", label: "Dashboard", icon: MdDashboard, path: "/admin" },
  {
    key: "appointment",
    label: "Appointment",
    icon: BsCalendar2Check,
    path: "/admin/appointments",
  },
  {
    key: "calendar",
    label: "Calendar",
    icon: MdCalendarToday,
    path: "/admin/calendar",
  },
  {
    key: "clinic-closures",
    label: "Clinic Closures",
    icon: MdEventBusy,
    path: "/admin/clinic-closures",
  },
  { key: "users", label: "Users", icon: MdPeople, path: "/admin/users" },
  {
    key: "settings",
    label: "Settings",
    icon: MdSettings,
    path: "/admin/settings",
  },
];

export const sidebarLogout = {
  key: "logout",
  label: "Logout",
  icon: MdLogout,
};
