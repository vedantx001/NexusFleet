import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, Circle, CarFront, AlertCircle, Wrench } from 'lucide-react';
import { useFleet } from '../fleetStore';
import Loader from '../../../../components/common/Loader';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import { getDashboardMetrics } from '../../../../features/dashboard/services/dashboardApi';

function StatusProgress({ label, count, total, color, icon: Icon }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#0B1220] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${color}`} />

      <div className="flex items-center justify-between pl-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white/5 ${color.replace('bg-', 'text-')}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-300">{label}</span>
        </div>
        <span className="text-xl font-bold text-white">{count}</span>
      </div>

      <div className="w-full h-1.5 bg-white/5 rounded-full mt-2 overflow-hidden relative z-10 pl-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <div className="text-right text-[10px] text-gray-500 font-semibold tracking-wider relative z-10 mt-1">
        {percentage}% OF FLEET
      </div>
    </div>
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
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {isLoading && vehicles.length === 0 ? <Loader label="Syncing Status…" /> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {dashboardError && !error ? <ErrorMessage message={dashboardError} /> : null}

      {/* LEFT PANEL: Distribution */}
      <div className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-(--brand-accent)/10 flex items-center justify-center">
              <CarFront className="w-4 h-4 text-(--brand-accent)" />
            </div>
            <h2 className="text-lg font-bold text-white">Vehicle Status Distribution</h2>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Total: <span className="text-white ml-1">{counts.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatusProgress icon={CheckCircle2} label="Available" count={counts.available} total={counts.total} color="bg-gray-400" />
          <StatusProgress icon={Activity} label="On Trip" count={counts.onTrip} total={counts.total} color="bg-(--success)" />
          <StatusProgress icon={Wrench} label="In Shop" count={counts.inShop} total={counts.total} color="bg-(--warning)" />
        </div>
      </div>

      {/* RIGHT PANEL: Operational Summary */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-(--brand-accent)/10 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-(--brand-accent)" />
          </div>
          <h2 className="text-lg font-bold text-white">Operational Insights</h2>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          {/* Static insightful UI blocks to make it look premium enterprise */}
          <div className="flex gap-3 items-start p-3 rounded-xl bg-[#0B1220] border border-white/5">
            <Circle className="w-2 h-2 mt-1.5 fill-(--warning) text-(--warning)" />
            <div>
              <p className="text-sm text-gray-300 font-medium">Maintenance Due Soon</p>
              <p className="text-xs text-gray-500 mt-1">12 vehicles require service within 500 miles.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-xl bg-[#0B1220] border border-white/5">
            <Circle className="w-2 h-2 mt-1.5 fill-(--danger) text-(--danger)" />
            <div>
              <p className="text-sm text-gray-300 font-medium">Critical Fuel Efficiency</p>
              <p className="text-xs text-gray-500 mt-1">Route 42B is experiencing 15% lower fuel economy.</p>
            </div>
          </div>

          <div className="flex gap-3 items-start p-3 rounded-xl bg-[#0B1220] border border-white/5">
            <Circle className="w-2 h-2 mt-1.5 fill-(--success) text-(--success)" />
            <div>
              <p className="text-sm text-gray-300 font-medium">Optimal Utilization</p>
              <p className="text-xs text-gray-500 mt-1">Northeast region operating at 98% efficiency.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
