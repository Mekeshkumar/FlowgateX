import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('@pages/common/HomePage'));
const EventsPage = lazy(() => import('@pages/common/EventsPage'));
const LoginPage = lazy(() => import('@pages/common/LoginPage'));
const RegisterPage = lazy(() => import('@pages/common/RegisterPage'));

const UserDashboard = lazy(() => import('@pages/user/Dashboard'));
const BookingsPage = lazy(() => import('@pages/user/BookingsPage'));

const OrganizerDashboard = lazy(() => import('@pages/organizer/Dashboard'));

const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));

const AppRoutes = () => {
  const { user } = useAuth();

  const getDashboardRoute = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'organizer':
        return '/organizer/dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-events"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Organizer Routes */}
      <Route
        path="/organizer/*"
        element={
          <ProtectedRoute roles={['organizer', 'admin']}>
            <Routes>
              <Route path="dashboard" element={<OrganizerDashboard />} />
              <Route path="events" element={<OrganizerDashboard />} />
              <Route path="create" element={<OrganizerDashboard />} />
              <Route path="analytics" element={<OrganizerDashboard />} />
              <Route path="attendees" element={<OrganizerDashboard />} />
              <Route path="checkin" element={<OrganizerDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminDashboard />} />
              <Route path="events" element={<AdminDashboard />} />
              <Route path="reports" element={<AdminDashboard />} />
              <Route path="iot" element={<AdminDashboard />} />
              <Route path="crowd" element={<AdminDashboard />} />
              <Route path="settings" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
