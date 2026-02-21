import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { FleetProvider } from '../context/FleetContext';
import makeRouter from './router';

export default function App() {
  const router = makeRouter();

  return (
    <AuthProvider>
      <FleetProvider>
        <RouterProvider router={router} />
      </FleetProvider>
    </AuthProvider>
  );
}
