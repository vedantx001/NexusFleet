import React from 'react';
import CommandCenterDashboard from '../components/dashboard/CommandCenterDashboard';
import { FleetProvider } from '../components/dashboard/fleetStore';

export default function DashboardPage() {
  return (
    <FleetProvider>
      <CommandCenterDashboard />
    </FleetProvider>
  );
}

