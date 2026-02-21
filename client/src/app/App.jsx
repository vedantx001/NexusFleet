import React from 'react';
import { RouterProvider } from 'react-router-dom';
import makeRouter from './router';

export default function App() {
  const router = makeRouter();

  return (
      <RouterProvider router={router} />
  );
}
