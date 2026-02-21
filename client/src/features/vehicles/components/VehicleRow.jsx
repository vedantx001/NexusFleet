import React from 'react';
import { CheckCircle2, Edit2, Trash2, Truck, Wrench } from 'lucide-react';
import { VEHICLE_ROLES, VEHICLE_STATUSES } from '../constants/vehicleConstants';
import Badge from './Badge';
import ToggleSwitch from './forms/ToggleSwitch';

export default function VehicleRow({ vehicle, role, onEdit, onDelete, onToggleOOS, onSendToMaintenance, onApproveMaintenance, onView }) {
  const isManager = role === VEHICLE_ROLES.MANAGER;
  const isOutOfService = vehicle.status === VEHICLE_STATUSES.OUT_OF_SERVICE.id;
  const isMaintenanceRequested = vehicle.status === VEHICLE_STATUSES.MAINTENANCE_REQUESTED.id;
  const isInShop = vehicle.status === VEHICLE_STATUSES.IN_SHOP.id;

  return (
    <tr
      className="border-b border-[var(--border)] hover:bg-[var(--bg-main)] transition-colors cursor-pointer group"
      onClick={() => onView(vehicle)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-secondary)]">
            <Truck size={20} />
          </div>
          <div>
            <div className="font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors">{vehicle.name}</div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">{vehicle.type}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="font-mono text-sm bg-[var(--bg-main)] px-2 py-1 rounded border border-[var(--border)] text-[var(--text-primary)]">
          {vehicle.plate}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{Number(vehicle.capacity).toLocaleString()} kg</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{Number(vehicle.odometer).toLocaleString()} km</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge statusId={vehicle.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-3">
          {isManager ? (
            <>
              <div className="flex items-center gap-2 mr-2 border-r border-[var(--border)] pr-4" title="Toggle Out Of Service">
                <span className="text-xs text-[var(--text-secondary)]">OOS</span>
                <ToggleSwitch checked={isOutOfService} onChange={(value) => onToggleOOS(vehicle.id, value)} />
              </div>
              {!isMaintenanceRequested && !isInShop ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSendToMaintenance(vehicle);
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--warning)] transition-colors p-1"
                  title="Send to Maintenance"
                >
                  <Wrench size={16} />
                </button>
              ) : null}
              {isMaintenanceRequested ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onApproveMaintenance(vehicle);
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--success)] transition-colors p-1"
                  title="Approve Maintenance"
                >
                  <CheckCircle2 size={16} />
                </button>
              ) : null}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(vehicle);
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--info)] transition-colors p-1"
                title="Edit Vehicle"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(vehicle);
                }}
                className="text-[var(--text-secondary)] hover:text-[var(--danger)] transition-colors p-1"
                title="Remove Vehicle"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <span className="text-xs text-[var(--text-secondary)] italic">View Only</span>
          )}
        </div>
      </td>
    </tr>
  );
}
