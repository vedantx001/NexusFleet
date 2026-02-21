import React from 'react';
import { Truck, Navigation, Settings, Calendar, Info, Clock, CheckCircle2 } from 'lucide-react';
import Badge from './Badge';
import Drawer from './Drawer';

export default function VehicleDetailsDrawer({ vehicle, isOpen, onClose }) {
  if (!vehicle) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Vehicle Overview">
      <div className="space-y-8 animate-in fade-in duration-500 pb-8">

        {/* Header Section */}
        <div className="flex items-start gap-5 pb-6 border-b border-[var(--border)]">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)] shadow-sm">
            <Truck size={36} strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-1">{vehicle.name}</h3>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-sm font-semibold bg-[var(--bg-main)] px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--text-primary)] shadow-sm">
                {vehicle.plate}
              </span>
              <Badge statusId={vehicle.status} />
            </div>
          </div>
        </div>

        {/* Operational Data Grid */}
        <section>
          <h4 className="text-sm font-bold tracking-wider text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-2">
            <Info size={16} /> Operational Data
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Vehicle Type</p>
              <p className="text-base font-medium text-[var(--text-primary)]">{vehicle.type}</p>
            </div>
            <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Max Capacity</p>
              <p className="text-base font-bold text-[var(--text-primary)]">{vehicle.capacity.toLocaleString()} <span className="text-sm font-medium opacity-70">kg</span></p>
            </div>
            <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Odometer</p>
              <p className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Settings size={14} className="text-[var(--text-secondary)]" />
                {vehicle.odometer.toLocaleString()} <span className="text-sm font-medium opacity-70">km</span>
              </p>
            </div>
            <div className="bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Region Hub</p>
              <p className="text-base font-medium text-[var(--text-primary)] flex items-center gap-2">
                <Navigation size={14} className="text-[var(--brand-accent)]" /> {vehicle.region}
              </p>
            </div>
          </div>
        </section>

        {/* Maintenance Summary Mockup for UX Polish */}
        <section className="pt-6 border-t border-[var(--border)]">
          <h4 className="text-sm font-bold tracking-wider text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-2">
            <Settings size={16} /> Maintenance Summary
          </h4>
          <div className="bg-[var(--bg-main)] p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <CheckCircle2 size={18} className="text-[var(--success)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Last Serviced</p>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">Routine inspection completed 12 days ago.</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-[var(--bg-surface)] px-2 py-1 rounded text-[var(--success)] border border-[var(--border)]">OK</span>
            </div>

            <div className="h-px bg-[var(--border)] w-full" />

            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Clock size={18} className="text-[var(--warning)] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Next Scheduled</p>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">Oil change and tire rotation due in 800 km.</p>
                </div>
              </div>
              <span className="text-xs font-bold bg-[var(--bg-surface)] px-2 py-1 rounded text-[var(--warning)] border border-[var(--border)]">SOON</span>
            </div>
          </div>
        </section>

      </div>
    </Drawer>
  );
}
