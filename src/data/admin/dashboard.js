// src/data/admin/dashboard.js
import {
  MdCalendarToday,
  MdUpcoming,
  MdCheckCircle,
  MdPendingActions,
  MdBookOnline,
  MdMessage,
  MdEventBusy,
  MdListAlt,
} from "react-icons/md";

// OVERVIEW CARDS
export const dashboardStats = [
  {
    id: "today",
    label: "Today's Appointment",
    value: 12,
    note: "+2 from yesterday",
    noteColor: "#E963C8",
    icon: MdCalendarToday,
    iconColor: "#E963C8",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    value: 18,
    note: "next 7 days",
    noteColor: "#1976D2",
    icon: MdUpcoming,
    iconColor: "#1976D2",
  },
  {
    id: "completed",
    label: "Completed",
    value: 12,
    note: "today",
    noteColor: "#11D896",
    icon: MdCheckCircle,
    iconColor: "#11D896",
  },
  {
    id: "pending",
    label: "Pending",
    value: 2,
    note: "today",
    noteColor: "#FFA000",
    icon: MdPendingActions,
    iconColor: "#FFA000",
  },
];

// TODAYS SCHEDULE
export const todaySchedule = [
  {
    id: "s1",
    time: "9:00 AM",
    patient: "Mea France Lacdao",
    service: "Dental Checkup",
    status: "completed",
  },
  {
    id: "s2",
    time: "9:30 AM",
    patient: "Rose Ann Lacdao",
    service: "Teeth Cleaning",
    status: "completed",
  },
  {
    id: "s3",
    time: "10:30 AM",
    patient: "Nicole Curita",
    service: "Tooth Filling",
    status: "upcoming",
  },
  {
    id: "s4",
    time: "11:00 AM",
    patient: "Issay Cueto",
    service: "Root Canal",
    status: "upcoming",
  },
  {
    id: "s5",
    time: "1:00 PM",
    patient: "Vegie Cueto",
    service: "Tooth Whitening",
    status: "upcoming",
  },
];

// NEXT APPOINTMENT
export const nextAppointment = {
  patient: "Nicole Curita",
  time: "10:30 AM",
  date: "July 1, 2026",
  service: "Tooth Filling",
  avatarColor: "#B388FF",
};

// UPCOMING APPOINTMENT LIST
export const upcomingAppointments = [
  {
    id: "u1",
    name: "Orlando Dela Cruz",
    service: "Dental Checkup",
    date: "Jun 2, 2026",
    time: "2:30 AM",
    avatarColor: "#E963C8",
  },
  {
    id: "u2",
    name: "Kwajalene Kent Si...",
    service: "Teeth Cleaning",
    date: "Jul 6, 2026",
    time: "11:30 AM",
    avatarColor: "#1976D2",
  },
  {
    id: "u3",
    name: "Bailey Celine Sinu...",
    service: "Tooth Filling",
    date: "Jul 6, 2026",
    time: "10:30 AM",
    avatarColor: "#FFC107",
  },
  {
    id: "u4",
    name: "Nica Galabit",
    service: "Dental Checkup",
    date: "Jul 10, 2026",
    time: "11:00 PM",
    avatarColor: "#11D896",
  },
];

// RECENT ACTIVITY
export const recentActivity = [
  {
    id: "a1",
    type: "booked",
    title: "New Appointment Booked",
    detail: "Sara Johnson on May 20 at 10:30AM",
    time: "10:15 AM",
    color: "#1976D2",
  },
  {
    id: "a2",
    type: "completed",
    title: "Appointment Completed",
    detail: "Michael Brown on May 20 at 9:00 AM",
    time: "9:45 AM",
    color: "#11D896",
  },
  {
    id: "a3",
    type: "cancelled",
    title: "Appointment Cancelled",
    detail: "Jennifer Davis on May 19 at 2:00 PM",
    time: "Yesterday",
    color: "#F81313",
  },
  {
    id: "a4",
    type: "closure",
    title: "Clinic Closure Added",
    detail: "Memorial Day on May 26, 2026",
    time: "May 18",
    color: "#B75DEB",
  },
  {
    id: "a5",
    type: "user",
    title: "New User Added",
    detail: "Rowena De Castro added to the system",
    time: "May 18",
    color: "#E963C8",
  },
  {
    id: "a6",
    type: "user",
    title: "New User Added",
    detail: "Rowena De Castro added to the system",
    time: "May 18",
    color: "#E963C8",
  },
];

// QUICK ACTIONS BUTTON (now includes icons and a flag to show/hide tooltip)
export const quickActions = [
  {
    id: "qa1",
    label: "Book Appointment",
    color: "#1976D2",
    bg: "rgba(132,187,242,0.25)",
    path: "/admin/appointments/new",
    icon: MdBookOnline,
    isComingSoon: false,
  },
  {
    id: "qa2",
    label: "See Messages",
    color: "#E963C8",
    bg: "rgba(252,152,227,0.25)",
    path: "/admin/messages",
    icon: MdMessage,
    isComingSoon: true,
  },
  {
    id: "qa3",
    label: "Add Clinic Closure",
    color: "#B75DEB",
    bg: "rgba(207,137,248,0.25)",
    path: "/admin/clinic-closures",
    icon: MdEventBusy,
    isComingSoon: false,
  },
  {
    id: "qa4",
    label: "Appointments List",
    color: "#11D896",
    bg: "rgba(131,241,204,0.25)",
    path: "/admin/appointments",
    icon: MdListAlt,
    isComingSoon: false,
  },
];