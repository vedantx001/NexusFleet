import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useFleet } from '../fleetStore';
import Loader from '../../../../components/common/Loader';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import { getDashboardMetrics } from '../../../../features/dashboard/services/dashboardApi';

function StatusTile({ icon: Icon, label, count }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 0.98 }, visible: { opacity: 1, scale: 1 } }}
      className="flex items-center justify-between p-5 rounded-2xl bg-(--bg-main) border border-(--border)"
    >
      <div className="flex items-center gap-3">
        <div className="text-(--text-secondary)">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-(--text-secondary)">{label}</span>
      </div>
      <span className="text-lg font-semibold text-(--text-primary)">{count}</span>
    </motion.div>
  );
}

function applyVehicleFilters(vehicle, filters) {
  if (!vehicle) return false;
  if (filters.type !== 'All' && vehicle.type !== filters.type) return false;
  if (filters.status !== 'All' && vehicle.status !== filters.status) return false;
  if (filters.region !== 'All' && vehicle.region !== filters.region) return false;
  return true;
}

export default function StatusOverview({ filters, onSync }) {
  const { vehicles, refreshFleet, isLoading, error } = useFleet();

  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [dashboardError, setDashboardError] = useState('');

  const areDefaultFilters =
    (filters?.type || 'All') === 'All' &&
    (filters?.status || 'All') === 'All' &&
    (filters?.region || 'All') === 'All';

  useEffect(() => {
    if (!areDefaultFilters) return;

    let cancelled = false;
    setDashboardError('');

    (async () => {
      try {
        const metrics = await getDashboardMetrics();
        if (!cancelled) setDashboardMetrics(metrics);
      } catch (err) {
        if (!cancelled) {
          const msg = err?.friendlyMessage || err?.message || 'Unable to load dashboard metrics.';
          setDashboardError(String(msg));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [areDefaultFilters]);

  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => applyVehicleFilters(v, filters)),
    [vehicles, filters]
  );

  const counts = useMemo(() => {
    if (areDefaultFilters && dashboardMetrics) {
      const idleVehicles = Number(dashboardMetrics?.idleVehicles) || 0;
      const vehiclesInShop = Number(dashboardMetrics?.vehiclesInShop) || 0;
      const activeFleet = Number(dashboardMetrics?.activeFleet) || 0;
      const onTrip = Math.max(0, activeFleet - idleVehicles - vehiclesInShop);

      return {
        available: idleVehicles,
        onTrip,
        inShop: vehiclesInShop,
        total: activeFleet,
      };
    }

    const available = filteredVehicles.filter((v) => v.status === 'Available').length;
    const onTrip = filteredVehicles.filter((v) => v.status === 'On Trip').length;
    const inShop = filteredVehicles.filter((v) => v.status === 'In Shop').length;

    return { available, onTrip, inShop, total: filteredVehicles.length };
  }, [areDefaultFilters, dashboardMetrics, filteredVehicles]);

  return (
    <motion.section
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="space-y-4"
    >
      {isLoading && vehicles.length === 0 ? <Loader label="Syncing…" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {dashboardError && !error ? <ErrorMessage message={dashboardError} /> : null}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--text-primary)">Fleet Status Overview</h2>
        <button
          type="button"
          onClick={async () => {
            await refreshFleet?.();
            onSync?.();
          }}
          className="text-sm font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors"
        >
          Sync Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2 rounded-2xl bg-(--bg-surface) border border-(--border) shadow-(--shadow-sm)">
        <StatusTile icon={CheckCircle2} label="Available" count={counts.available} />
        <StatusTile icon={Activity} label="On Trip" count={counts.onTrip} />
        <StatusTile icon={AlertTriangle} label="In Shop" count={counts.inShop} />
        <StatusTile icon={Clock} label="Total" count={counts.total} />
      </div>
    </motion.section>
  );
}
