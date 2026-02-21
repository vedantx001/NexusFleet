import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import VehiclesPage from '../features/vehicles/pages/VehiclesPage';
import useAuth from '../features/auth/hooks/useAuth';
import TripDispatcherPage from './pages/TripDispatcherPage';

function RootLayout() {
  return <Outlet />;
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-(--border) bg-(--bg-surface) p-6 shadow-sm">Loading session…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function makeRouter() {
  return createBrowserRouter([
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/register', element: <Navigate to="/signup" replace /> },
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        {
          element: <AppShell />,
          children: [
            {
              path: 'dashboard',
              element: (
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              ),
            },
            {
              path: 'dispatch',
              element: (
                <ProtectedRoute>
                  <TripDispatcherPage />
                </ProtectedRoute>
              ),
            },
            {
              path: 'vehicles',
              element: (
                <ProtectedRoute>
                  <VehiclesPage />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);
}

