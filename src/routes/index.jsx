import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '@components/layout/Layout';
import MainLayout from '@components/layout/MainLayout';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/public/HomePage'));
const EventsPage = lazy(() => import('@pages/user/EventsPage'));
const LoginPage = lazy(() => import('@pages/public/LoginPage'));
const RegisterPage = lazy(() => import('@pages/public/RegisterPage'));
const BookingPage = lazy(() => import('@pages/user/BookingsPage'));

const UserDashboard = lazy(() => import('@pages/user/Dashboard'));
const BookingsPage = lazy(() => import('@pages/user/BookingsPage'));

const OrganizerDashboard = lazy(() => import('@pages/organizer/Dashboard'));

const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const LayoutPreview = lazy(() => import('@pages/public/LayoutPreview'));

const AppRoutes = () => {
  return (
    <Routes>


      {/* Home page with MainLayout (Header & Footer only) */}
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />

      {/* Other public routes with layout */}
      <Route element={<Layout />}>
        <Route path="/events" element={<EventsPage />} />
        <Route path="/layout-preview" element={<LayoutPreview />} />
        <Route path="/booking/:eventId" element={<BookingPage />} />
        <Route path="/bookings" element={<BookingPage />} />
      </Route>

      {/* Auth routes without main layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* Layout for authenticated users - only wrap with ProtectedRoute, not Layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute roles={["user", "organizer", "admin"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* User Routes */}
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="my-bookings" element={<BookingsPage />} />
        <Route path="my-events" element={<UserDashboard />} />
        <Route path="favorites" element={<UserDashboard />} />
        <Route path="events" element={<EventsPage />} />

        {/* Organizer Routes */}
        <Route path="organizer/dashboard" element={<OrganizerDashboard />} />
        <Route path="organizer/events" element={<OrganizerDashboard />} />
        <Route path="organizer/create" element={<OrganizerDashboard />} />
        <Route path="organizer/analytics" element={<OrganizerDashboard />} />
        <Route path="organizer/attendees" element={<OrganizerDashboard />} />
        <Route path="organizer/checkin" element={<OrganizerDashboard />} />

        {/* Admin Routes */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminDashboard />} />
        <Route path="admin/events" element={<AdminDashboard />} />
        <Route path="admin/reports" element={<AdminDashboard />} />
        <Route path="admin/iot" element={<AdminDashboard />} />
        <Route path="admin/crowd" element={<AdminDashboard />} />
        <Route path="admin/settings" element={<AdminDashboard />} />

        {/* Catch-all for authenticated users */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Catch-all redirect for unauthenticated users */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


export default AppRoutes;
