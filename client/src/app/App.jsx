import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import makeRouter from './router';

export default function App() {
  const router = makeRouter();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
