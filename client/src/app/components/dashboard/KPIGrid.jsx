import React, { useEffect, useMemo, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Activity, AlertTriangle, Package, Truck } from 'lucide-react';
import { useFleet } from './fleetStore';

function AnimatedNumber({ value, pulseKey }) {
  const [prev, setPrev] = useState(value);
  const controls = useAnimation();

  useEffect(() => {
    if (value === prev && pulseKey === undefined) return;
    controls.start({
      scale: [1, 1.05, 1],
      color: ['var(--text-primary)', 'var(--brand-accent)', 'var(--text-primary)'],
      transition: { duration: 0.45, ease: 'easeOut' },
    });
    setPrev(value);
  }, [value, prev, controls, pulseKey]);

  return (
    <motion.span animate={controls} className="inline-block origin-left">
      {value}
    </motion.span>
  );
}

function KPICard({ title, value, icon: Icon, unit, pulseKey }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      className="relative p-6 rounded-2xl bg-(--bg-surface) border border-(--border) shadow-(--shadow-md) overflow-hidden group"
    >
      <div className="absolute inset-0 bg-linear-to-br from-(--brand-accent)/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-(--text-secondary) mb-2">{title}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-4xl font-semibold text-(--text-primary) tracking-tight">
              <AnimatedNumber value={value} pulseKey={pulseKey} />
            </h3>
            {unit ? <span className="text-lg font-medium text-(--text-secondary)">{unit}</span> : null}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-(--bg-main) border border-(--border)">
          <Icon className="w-5 h-5 text-(--brand-primary)" />
        </div>
      </div>
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

export default function KPIGrid({ filters, pulseKey }) {
  const { vehicles, trips } = useFleet();

  const vehiclesById = useMemo(() => Object.fromEntries(vehicles.map((v) => [v.id, v])), [vehicles]);

  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => applyVehicleFilters(v, filters)),
    [vehicles, filters]
  );

  const metrics = useMemo(() => {
    const totalVehicles = filteredVehicles.length;
    const activeFleet = filteredVehicles.filter((v) => v.status === 'On Trip').length;
    const maintenanceAlerts = filteredVehicles.filter((v) => v.status === 'In Shop').length;
    const available = filteredVehicles.filter((v) => v.status === 'Available').length;
    const utilizationRate = totalVehicles ? Math.min(100, Math.round(((totalVehicles - available) / totalVehicles) * 100)) : 0;

    const pendingCargo = trips.filter((t) => {
      if (t.status !== 'Draft') return false;
      const vehicle = t.vehicleId ? vehiclesById[t.vehicleId] : undefined;
      return applyVehicleFilters(vehicle, filters);
    }).length;

    return {
      activeFleet,
      maintenanceAlerts,
      utilizationRate,
      pendingCargo,
    };
  }, [filteredVehicles, trips, vehiclesById, filters]);

  const cards = [
    { title: 'Active Fleet', value: metrics.activeFleet, icon: Truck, unit: '' },
    { title: 'Maintenance Alerts', value: metrics.maintenanceAlerts, icon: AlertTriangle, unit: '' },
    { title: 'Utilization Rate', value: metrics.utilizationRate, icon: Activity, unit: '%' },
    { title: 'Pending Cargo', value: metrics.pendingCargo, icon: Package, unit: '' },
  ];

  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {cards.map((card) => (
        <KPICard key={card.title} {...card} pulseKey={pulseKey} />
      ))}
    </motion.div>
  );
}
