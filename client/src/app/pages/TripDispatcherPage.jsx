import React from 'react';
import TripDispatcher from '../components/dashboard/TripDispatcher';
import { FleetProvider } from '../components/dashboard/fleetStore';

export default function TripDispatcherPage() {
  return (
    <FleetProvider>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <TripDispatcher />
      </div>
    </FleetProvider>
  );
}
