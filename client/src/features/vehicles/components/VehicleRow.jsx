import React from 'react';
import { CheckCircle2, Edit2, Trash2, Truck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { VEHICLE_ROLES, VEHICLE_STATUSES } from '../constants/vehicleConstants';
import Badge from './Badge';
import ToggleSwitch from './forms/ToggleSwitch';

export default function VehicleRow({ vehicle, role, onEdit, onDelete, onToggleOOS, onSendToMaintenance, onApproveMaintenance, onView, index }) {
  const isManager = role === VEHICLE_ROLES.MANAGER;
  const isOutOfService = vehicle.status === VEHICLE_STATUSES.OUT_OF_SERVICE.id;
  const isMaintenanceRequested = vehicle.status === VEHICLE_STATUSES.MAINTENANCE_REQUESTED.id;
  const isInShop = vehicle.status === VEHICLE_STATUSES.IN_SHOP.id;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ backgroundColor: 'var(--bg-main)', scale: 1.002, transition: { duration: 0.2 } }}
      className="border-b border-[var(--border)] group cursor-pointer"
      onClick={() => onView(vehicle)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] shadow-sm group-hover:border-[var(--brand-accent)]/30 group-hover:text-[var(--brand-accent)] transition-all duration-300">
            <Truck size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-accent)] transition-colors text-base mb-0.5">{vehicle.name}</div>
            <div className="text-xs font-medium text-[var(--text-secondary)] tracking-wide uppercase">{vehicle.type}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="inline-flex items-center justify-center font-mono text-sm font-semibold bg-[var(--bg-main)] px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-primary)] shadow-sm">
          {vehicle.plate}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
          {Number(vehicle.capacity).toLocaleString()} <span className="text-xs font-medium opacity-70">kg</span>
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
          {Number(vehicle.odometer).toLocaleString()} <span className="text-xs font-medium opacity-70">km</span>
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge statusId={vehicle.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {isManager ? (
            <>
              <div className="flex items-center gap-3 mr-3 border-r border-[var(--border)] pr-5" title="Toggle Out Of Service">
                <span className="text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase">OOS</span>
                <ToggleSwitch checked={isOutOfService} onChange={(value) => onToggleOOS(vehicle.id, value)} />
              </div>

              {!isMaintenanceRequested && !isInShop ? (
                <button
                  onClick={() => onSendToMaintenance(vehicle)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] hover:border-[var(--warning)]/50 hover:bg-[var(--warning)]/10 hover:text-[var(--warning)] transition-all transform hover:scale-105"
                  title="Send to Maintenance"
                >
                  <Wrench size={18} strokeWidth={2.5} />
                </button>
              ) : null}

              {isMaintenanceRequested ? (
                <button
                  onClick={() => onApproveMaintenance(vehicle)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] hover:border-[var(--success)]/50 hover:bg-[var(--success)]/10 hover:text-[var(--success)] transition-all transform hover:scale-105"
                  title="Approve Maintenance"
                >
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </button>
              ) : null}

              <button
                onClick={() => onEdit(vehicle)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] hover:border-[var(--info)]/50 hover:bg-[var(--info)]/10 hover:text-[var(--info)] transition-all transform hover:scale-105"
                title="Edit Vehicle"
              >
                <Edit2 size={18} strokeWidth={2.5} />
              </button>

              <button
                onClick={() => onDelete(vehicle)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-transparent text-[var(--text-secondary)] hover:border-[var(--danger)]/50 hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] transition-all transform hover:scale-105 ml-1"
                title="Remove Vehicle"
              >
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </>
          ) : (
            <span className="text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase bg-[var(--bg-main)] px-3 py-1.5 rounded-lg border border-[var(--border)]">View Only</span>
          )}
        </div>
      </td>
    </motion.tr>
  );
}
