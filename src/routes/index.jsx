import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '@components/layout/Layout';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/public/HomePage'));
const EventsPage = lazy(() => import('@pages/public/EventsPage'));
const LoginPage = lazy(() => import('@pages/public/LoginPage'));
const RegisterPage = lazy(() => import('@pages/public/RegisterPage'));
const BookingPage = lazy(() => import('@pages/public/BookingPage'));

const UserDashboard = lazy(() => import('@pages/user/Dashboard'));
const BookingsPage = lazy(() => import('@pages/user/BookingsPage'));

const OrganizerDashboard = lazy(() => import('@pages/organizer/Dashboard'));

const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const LayoutPreview = lazy(() => import('@pages/public/LayoutPreview'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/layout-preview" element={<LayoutPreview />} />

      {/* Booking Flow - Can be accessed by anyone */}
      <Route path="/booking/:eventId" element={<BookingPage />} />

      {/* Booking page at /bookings endpoint */}
      <Route path="/bookings" element={<BookingPage />} />

      {/* Layout for authenticated users */}
      <Route
        path="/*"
        element={
          <ProtectedRoute roles={["user", "organizer", "admin"]}>
            <Layout>
              <Routes>
                {/* User Routes */}
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="my-bookings" element={<BookingsPage />} />
                <Route path="my-events" element={<UserDashboard />} />
                <Route path="favorites" element={<UserDashboard />} />

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
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect for unauthenticated users */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
