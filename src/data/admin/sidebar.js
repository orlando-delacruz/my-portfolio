// src/data/admin/sidebar.js
import {
  MdDashboard,
  MdCalendarToday,
  MdEventBusy,
  MdPeople,
  MdSettings,
  MdLogout,
  MdWeb,
} from 'react-icons/md';
import { BsCalendar2Check } from 'react-icons/bs';
import { FaUserMd } from 'react-icons/fa';

export const sidebarNavItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: MdDashboard,
    path: '/admin',
  },
  {
    key: 'appointment',
    label: 'Appointment',
    icon: BsCalendar2Check,
    path: '/admin/appointments',
  },
  {
    key: 'calendar',
    label: 'Calendar',
    icon: MdCalendarToday,
    path: '/admin/calendar',
  },
  {
    key: 'clinic-closures',
    label: 'Clinic Closures',
    icon: MdEventBusy,
    path: '/admin/clinic-closures',
  },
  {
    key: 'patients',
    label: 'Patients',
    icon: FaUserMd,
    path: '/admin/patients',
  },
  {
    key: 'users',
    label: 'Users',
    icon: MdPeople,
    path: '/admin/users',
  },
  {
    key: 'cms',
    label: 'CMS',
    icon: MdWeb,
    children: [
      { key: 'cms-hero', label: 'Hero Section', path: '/admin/cms/hero' },
      { key: 'cms-about', label: 'About Section', path: '/admin/cms/about' },
      { key: 'cms-services', label: 'Services Section', path: '/admin/cms/services' },
      { key: 'cms-why-choose-us', label: 'Why Choose Us', path: '/admin/cms/why-choose-us' },
      { key: 'cms-testimonials', label: 'Testimonials', path: '/admin/cms/testimonials' },
      { key: 'cms-faqs', label: 'FAQs', path: '/admin/cms/faqs' },
      { key: 'cms-contact', label: 'Contact Section', path: '/admin/cms/contact' },
      { key: 'cms-footer', label: 'Footer', path: '/admin/cms/footer' },
    ],
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: MdSettings,
    path: '/admin/settings',
  },
];

export const sidebarLogout = {
  key: 'logout',
  label: 'Logout',
  icon: MdLogout,
};