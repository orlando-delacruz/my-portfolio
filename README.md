
```
leidi-bud-dentals
├─ api
│  ├─ admin
│  │  └─ users.js
│  ├─ cancel-appointment.js
│  ├─ send-confirmation.js
│  ├─ send-faq.js
│  ├─ send-reminders.js
│  └─ validate-token.js
├─ eslint.config.js
├─ index.html
├─ package.json
├─ public
│  └─ logo.png
├─ README.md
├─ src
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ fonts
│  │  │  ├─ inter-v20-latin-500.woff2
│  │  │  ├─ inter-v20-latin-600.woff2
│  │  │  └─ inter-v20-latin-regular.woff2
│  │  └─ images
│  │     ├─ about-bg.webp
│  │     ├─ cta-bg.webp
│  │     ├─ hero-bg.webp
│  │     ├─ logo-white.webp
│  │     └─ logo.webp
│  ├─ components
│  │  ├─ admin
│  │  │  ├─ AdminLayout
│  │  │  │  ├─ AdminLayout.jsx
│  │  │  │  ├─ AdminLayout.styled.js
│  │  │  │  └─ index.js
│  │  │  ├─ Button
│  │  │  │  ├─ Button.jsx
│  │  │  │  ├─ Button.styled.js
│  │  │  │  └─ index.js
│  │  │  ├─ Card
│  │  │  │  ├─ BranchLegendCard
│  │  │  │  │  ├─ BranchLegendCard.jsx
│  │  │  │  │  ├─ BranchLegendCard.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  └─ CalendarEventCard
│  │  │  │     ├─ CalendarEventCard.jsx
│  │  │  │     ├─ CalendarEventCard.styled.js
│  │  │  │     └─ index.js
│  │  │  ├─ Filter
│  │  │  │  ├─ Branch
│  │  │  │  │  ├─ Branch.jsx
│  │  │  │  │  ├─ Branch.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ ClosureStatus
│  │  │  │  │  ├─ ClosureStatus.jsx
│  │  │  │  │  ├─ ClosureStatus.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ ClosureType
│  │  │  │  │  ├─ ClosureType.jsx
│  │  │  │  │  ├─ ClosureType.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ Date
│  │  │  │  │  ├─ Date.jsx
│  │  │  │  │  ├─ Date.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ Filters
│  │  │  │  │  ├─ Filters.jsx
│  │  │  │  │  ├─ Filters.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ MobileFilterToggle.jsx
│  │  │  │  ├─ Search
│  │  │  │  │  ├─ index.js
│  │  │  │  │  ├─ Search.jsx
│  │  │  │  │  └─ Search.styled.js
│  │  │  │  └─ Status
│  │  │  │     ├─ index.js
│  │  │  │     ├─ Status.jsx
│  │  │  │     └─ Status.styled.js
│  │  │  ├─ Footer
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Footer.styled.js
│  │  │  │  └─ index.js
│  │  │  ├─ Modal
│  │  │  │  ├─ AppointmentDetailsModal
│  │  │  │  │  ├─ AppointmentDetailsModal.jsx
│  │  │  │  │  ├─ AppointmentDetailsModal.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ AppointmentModal
│  │  │  │  │  ├─ AddAppointmentModal.jsx
│  │  │  │  │  ├─ AppointmentForm.jsx
│  │  │  │  │  ├─ appointmentFormSchema.js
│  │  │  │  │  ├─ AppointmentModal.styled.js
│  │  │  │  │  ├─ index.js
│  │  │  │  │  ├─ RescheduleModal.jsx
│  │  │  │  │  └─ useAppointmentModal.js
│  │  │  │  ├─ ClinicClosureDetailsModal
│  │  │  │  │  ├─ ClinicClosureDetailsModal.jsx
│  │  │  │  │  ├─ ClinicClosureDetailsModal.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ ClinicClosureModal
│  │  │  │  │  ├─ ClinicClosureModal.jsx
│  │  │  │  │  ├─ ClinicClosureModal.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ EditPatientModal
│  │  │  │  │  ├─ EditPatientModal.jsx
│  │  │  │  │  ├─ EditPatientModal.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  ├─ PatientDetailsModal
│  │  │  │  │  ├─ index.js
│  │  │  │  │  ├─ PatientDetailsModal.jsx
│  │  │  │  │  └─ PatientDetailsModal.styled.js
│  │  │  │  ├─ UserDetailsModal
│  │  │  │  │  ├─ index.js
│  │  │  │  │  ├─ UserDetailsModal.jsx
│  │  │  │  │  └─ UserDetailsModal.styled.js
│  │  │  │  └─ UserModal
│  │  │  │     ├─ index.js
│  │  │  │     ├─ UserModal.jsx
│  │  │  │     └─ UserModal.styled.js
│  │  │  ├─ Pagination
│  │  │  │  ├─ index.js
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  └─ Pagination.styled.js
│  │  │  ├─ SideBar
│  │  │  │  ├─ index.js
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  └─ SideBar.styled.js
│  │  │  └─ TopBar
│  │  │     ├─ index.js
│  │  │     ├─ TopBar.jsx
│  │  │     └─ TopBar.styled.js
│  │  ├─ common
│  │  │  └─ SectionTitle
│  │  │     ├─ index.js
│  │  │     ├─ SectionTitle.jsx
│  │  │     └─ SectionTitle.styled.js
│  │  ├─ layout
│  │  │  ├─ CallToAction
│  │  │  │  ├─ CallToAction.jsx
│  │  │  │  ├─ CallToAction.styled.js
│  │  │  │  └─ index.js
│  │  │  ├─ Footer
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Footer.styled.js
│  │  │  │  └─ index.js
│  │  │  └─ Header
│  │  │     ├─ Header.jsx
│  │  │     ├─ Header.styled.js
│  │  │     ├─ index.js
│  │  │     └─ useHeader.js
│  │  └─ ui
│  │     ├─ Accordion
│  │     │  └─ FaqAccordion
│  │     │     ├─ FaqAccordion.jsx
│  │     │     ├─ FaqAccordion.styled.js
│  │     │     └─ index.js
│  │     ├─ Button
│  │     │  ├─ Button.jsx
│  │     │  ├─ Button.styled.js
│  │     │  └─ index.js
│  │     ├─ Card
│  │     │  ├─ BranchCard
│  │     │  │  ├─ BranchCard.jsx
│  │     │  │  ├─ BranchCard.styled.js
│  │     │  │  └─ index.js
│  │     │  ├─ ServiceCard
│  │     │  │  ├─ index.js
│  │     │  │  ├─ ServiceCard.jsx
│  │     │  │  └─ ServiceCard.styled.js
│  │     │  └─ TestimonialCard
│  │     │     ├─ index.js
│  │     │     ├─ TestimonialCard.jsx
│  │     │     └─ TestimonialCard.styled.js
│  │     ├─ Email
│  │     │  ├─ ConfirmationEmail.jsx
│  │     │  └─ ReminderEmail.jsx
│  │     ├─ Fields
│  │     │  ├─ BranchToggleField
│  │     │  │  ├─ BranchToggleField.jsx
│  │     │  │  └─ BranchToggleField.styled.js
│  │     │  ├─ index.js
│  │     │  ├─ SelectField
│  │     │  │  ├─ SelectField.jsx
│  │     │  │  └─ SelectField.styled.js
│  │     │  └─ TextField
│  │     │     ├─ TextField.jsx
│  │     │     └─ TextField.styled.js
│  │     ├─ Form
│  │     │  ├─ BookAppointmentForm
│  │     │  │  ├─ BookAppointmentForm.jsx
│  │     │  │  ├─ BookAppointmentForm.styled.js
│  │     │  │  ├─ index.js
│  │     │  │  └─ useBookAppointmentForm.js
│  │     │  └─ FaqForm
│  │     │     ├─ FaqForm.jsx
│  │     │     ├─ FaqForm.styled.js
│  │     │     └─ index.js
│  │     ├─ Modal
│  │     │  ├─ BranchModal
│  │     │  │  ├─ BranchModal.jsx
│  │     │  │  ├─ BranchModal.styled.js
│  │     │  │  └─ index.js
│  │     │  └─ ServiceModal
│  │     │     ├─ index.js
│  │     │     ├─ ServiceModal.jsx
│  │     │     └─ ServiceModal.styled.js
│  │     └─ SuccessView
│  │        ├─ index.js
│  │        ├─ SuccessView.jsx
│  │        └─ SuccessView.styled.js
│  ├─ constants
│  │  └─ calendarConstants.js
│  ├─ contexts
│  ├─ data
│  │  ├─ admin
│  │  │  ├─ appointment.js
│  │  │  ├─ clinicClosures.js
│  │  │  ├─ dashboard.js
│  │  │  ├─ mockCalendarAppointments.js
│  │  │  └─ sidebar.js
│  │  ├─ callToAction.js
│  │  ├─ footer.js
│  │  ├─ HomePage
│  │  │  ├─ about.js
│  │  │  ├─ branch.js
│  │  │  ├─ faqs.js
│  │  │  ├─ gallery.js
│  │  │  ├─ hero.js
│  │  │  ├─ services.js
│  │  │  ├─ testimonials.js
│  │  │  └─ whyUs.js
│  │  └─ navbar.js
│  ├─ guards
│  ├─ hooks
│  │  ├─ useAppointmentAvailability.js
│  │  ├─ useAppointments.js
│  │  ├─ useBranches.js
│  │  ├─ useCalendarAppointments.js
│  │  ├─ useCurrentUser.js
│  │  ├─ useDashboardData.js
│  │  ├─ useMobileFilter.js
│  │  ├─ usePatients.js
│  │  ├─ useRealtimeAppointments.js
│  │  ├─ useScheduling.js
│  │  ├─ useServiceBranches.js
│  │  └─ useUsers.js
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ admin
│  │  │  ├─ Appointment
│  │  │  │  ├─ Appointment.jsx
│  │  │  │  ├─ Appointment.styled.js
│  │  │  │  ├─ index.js
│  │  │  │  └─ sections
│  │  │  │     ├─ Filter
│  │  │  │     │  ├─ Filter.jsx
│  │  │  │     │  ├─ Filter.styled.js
│  │  │  │     │  └─ index.js
│  │  │  │     ├─ PageTitle
│  │  │  │     │  ├─ index.js
│  │  │  │     │  ├─ PageTitle.jsx
│  │  │  │     │  └─ PageTitle.styled.js
│  │  │  │     └─ Table
│  │  │  │        ├─ index.js
│  │  │  │        ├─ Table.jsx
│  │  │  │        └─ Table.styled.js
│  │  │  ├─ Calendar
│  │  │  │  ├─ AppointmentCalendar
│  │  │  │  │  ├─ AppointmentCalendar.jsx
│  │  │  │  │  ├─ AppointmentCalendar.styled.js
│  │  │  │  │  └─ index.js
│  │  │  │  └─ sections
│  │  │  │     ├─ PageTitle
│  │  │  │     │  ├─ index.js
│  │  │  │     │  ├─ PageTitle.jsx
│  │  │  │     │  └─ PageTitle.styled.js
│  │  │  │     ├─ ScheduleCalendar
│  │  │  │     │  ├─ index.js
│  │  │  │     │  ├─ ScheduleCalendar.jsx
│  │  │  │     │  └─ ScheduleCalendar.styled.js
│  │  │  │     └─ Toolbar
│  │  │  │        ├─ index.js
│  │  │  │        ├─ Toolbar.jsx
│  │  │  │        └─ Toolbar.styled.js
│  │  │  ├─ ClinicClosures
│  │  │  │  ├─ ClinicClosures.jsx
│  │  │  │  ├─ ClinicClosures.styled.js
│  │  │  │  ├─ index.js
│  │  │  │  ├─ sections
│  │  │  │  │  ├─ Filter
│  │  │  │  │  │  ├─ Filter.jsx
│  │  │  │  │  │  ├─ Filter.styled.js
│  │  │  │  │  │  └─ index.js
│  │  │  │  │  ├─ PageTitle
│  │  │  │  │  │  ├─ index.js
│  │  │  │  │  │  ├─ PageTitle.jsx
│  │  │  │  │  │  └─ PageTitle.styled.js
│  │  │  │  │  └─ Table
│  │  │  │  │     ├─ index.js
│  │  │  │  │     ├─ Table.jsx
│  │  │  │  │     └─ Table.styled.js
│  │  │  │  └─ useClinicClosures.js
│  │  │  ├─ Dashboard
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ Dashboard.styled.js
│  │  │  │  ├─ sections
│  │  │  │  └─ useDashboard.js
│  │  │  ├─ PageDevelopment.jsx
│  │  │  ├─ Patients
│  │  │  │  ├─ index.js
│  │  │  │  ├─ Patients.jsx
│  │  │  │  └─ Patients.styled.js
│  │  │  └─ Users
│  │  │     ├─ index.js
│  │  │     ├─ sections
│  │  │     │  └─ Table
│  │  │     │     ├─ index.js
│  │  │     │     ├─ Table.jsx
│  │  │     │     └─ Table.styled.js
│  │  │     ├─ Users.jsx
│  │  │     └─ Users.styled.js
│  │  ├─ auth
│  │  │  ├─ index.js
│  │  │  ├─ Login.jsx
│  │  │  ├─ Login.styled.js
│  │  │  └─ useLogin.js
│  │  └─ public
│  │     ├─ BookAppointment
│  │     │  ├─ BookAppointment.jsx
│  │     │  ├─ BookAppointment.styled.js
│  │     │  └─ index.js
│  │     ├─ CancelAppointment
│  │     │  ├─ CancelAppointment.jsx
│  │     │  ├─ CancelAppointment.styled.js
│  │     │  ├─ index.js
│  │     │  └─ useCancelAppointment.js
│  │     └─ Home
│  │        ├─ Home.jsx
│  │        ├─ index.js
│  │        └─ sections
│  │           ├─ About
│  │           │  ├─ About.jsx
│  │           │  ├─ About.styled.js
│  │           │  └─ index.js
│  │           ├─ Branch
│  │           │  ├─ Branch.jsx
│  │           │  ├─ Branch.styled.js
│  │           │  └─ index.js
│  │           ├─ Faqs
│  │           │  ├─ Faqs.jsx
│  │           │  ├─ Faqs.styled.js
│  │           │  └─ index.js
│  │           ├─ Gallery
│  │           │  ├─ Gallery.jsx
│  │           │  ├─ Gallery.styled.js
│  │           │  └─ index.js
│  │           ├─ Hero
│  │           │  ├─ Hero.jsx
│  │           │  ├─ Hero.styled.js
│  │           │  └─ index.js
│  │           ├─ Sevices
│  │           │  ├─ index.js
│  │           │  ├─ Services.styled.js
│  │           │  ├─ Sevices.jsx
│  │           │  └─ useServices.js
│  │           ├─ Testimonial
│  │           │  ├─ index.js
│  │           │  ├─ Testimonial.jsx
│  │           │  └─ Testimonial.styled.js
│  │           └─ WhyUs
│  │              ├─ index.js
│  │              ├─ WhyUs.jsx
│  │              └─ WhyUs.styled.js
│  ├─ providers
│  │  └─ AuthProvider.jsx
│  ├─ routes
│  │  ├─ ProtectedRoute.jsx
│  │  └─ PublicRoutes.jsx
│  ├─ services
│  │  ├─ admins.js
│  │  ├─ appointments.js
│  │  ├─ branches.js
│  │  ├─ calendar.js
│  │  ├─ clinicClosures.js
│  │  ├─ dashboard.js
│  │  ├─ patients.js
│  │  ├─ publicBooking.js
│  │  ├─ scheduling.js
│  │  ├─ serviceBranches.js
│  │  ├─ storage.js
│  │  └─ supabase
│  │     ├─ auth.js
│  │     └─ supabase.js
│  ├─ store
│  │  ├─ authStore.js
│  │  ├─ useAdminStore.js
│  │  └─ useCalendarStore.js
│  ├─ styles
│  │  ├─ adminTheme.js
│  │  ├─ fonts.css
│  │  ├─ global.js
│  │  └─ theme.js
│  └─ utils
│     ├─ appointmentMapper.js
│     ├─ branchUtils.js
│     ├─ calendarGrid.js
│     ├─ conflictMessage.js
│     ├─ convert-images.mjs
│     ├─ dateFormatter.js
│     ├─ mapAppointmentRow.js
│     ├─ phoneFormatter.js
│     ├─ scheduling.js
│     └─ ScrollToTop.js
├─ vercel.json
├─ vite.config.js
└─ yarn.lock

```