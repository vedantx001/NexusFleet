import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import makeRouter from './router';
import DriverProfiles from '../features/drivers/pages/DriverProfiles';
import DataTable from '../components/table/DataTable';
import ExpenseFuel from '../features/expenses/pages/ExpenseFuel';
import Analytics from '../features/analytics/pages/Analytics';

export default function App() {
  const router = makeRouter();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  
  );
}
