import React from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import useAuth from '../features/auth/hooks/useAuth';

function ProtectedRoute({ children }) {
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">Loading session…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/dashboard' } }} />;
  }

  return children;
}

export default function makeRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <AppShell />,
      children: [
        { index: true, element: <HomePage /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
}
