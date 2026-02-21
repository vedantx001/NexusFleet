import React from 'react';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import VehicleRow from './VehicleRow';

export default function VehicleTable({
  vehicles,
  role,
  currentPage,
  totalPages,
  itemsPerPage,
  filteredCount,
  setCurrentPage,
  onEdit,
  onDelete,
  onToggleOOS,
  onSendToMaintenance,
  onApproveMaintenance,
  onView,
}) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--bg-main)] text-[var(--text-secondary)] uppercase text-xs border-b border-[var(--border)]">
            <tr>
              <th className="px-6 py-4 font-semibold tracking-wider">Vehicle Details</th>
              <th className="px-6 py-4 font-semibold tracking-wider">License Plate</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Capacity</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Odometer</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-surface)]">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <VehicleRow
                  key={vehicle.id}
                  vehicle={vehicle}
                  role={role}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleOOS={onToggleOOS}
                  onSendToMaintenance={onSendToMaintenance}
                  onApproveMaintenance={onApproveMaintenance}
                  onView={onView}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-[var(--text-secondary)]">
                    <Truck size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium text-[var(--text-primary)]">No vehicles found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCount > 0 ? (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-surface)]">
          <p className="text-sm text-[var(--text-secondary)]">
            Showing <span className="font-medium text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, filteredCount)}</span> of{' '}
            <span className="font-medium text-[var(--text-primary)]">{filteredCount}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
