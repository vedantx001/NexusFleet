import React from 'react';
import {
  createBrowserRouter,
  Outlet,
} from 'react-router-dom';
import AppShell from './components/AppShell';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TripDispatcherPage from './pages/TripDispatcherPage';

function RootLayout() {
  return <Outlet />;
}

export default function makeRouter() {
  return createBrowserRouter([
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
              element: <DashboardPage />, // UI-only: allow access without login
            },
            {
              path: 'dispatch',
              element: <TripDispatcherPage />,
            },
          ],
        },
      ],
    },
  ]);
}

