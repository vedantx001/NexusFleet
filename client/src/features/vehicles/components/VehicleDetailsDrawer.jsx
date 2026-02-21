import React from 'react';
import { MapPin, Truck } from 'lucide-react';
import Badge from './Badge';
import Drawer from './Drawer';

export default function VehicleDetailsDrawer({ vehicle, isOpen, onClose }) {
  if (!vehicle) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Vehicle Details">
      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[var(--border)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)]">
            <Truck size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{vehicle.name}</h3>
            <p className="text-[var(--text-secondary)] font-mono">{vehicle.plate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
            <Badge statusId={vehicle.status} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Vehicle Type</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">{vehicle.type}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Max Capacity</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">{vehicle.capacity} kg</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Odometer</p>
            <p className="text-sm font-medium text-[var(--text-primary)]">{vehicle.odometer.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1">Region</p>
            <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
              <MapPin size={14} className="text-[var(--text-secondary)]" /> {vehicle.region}
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
