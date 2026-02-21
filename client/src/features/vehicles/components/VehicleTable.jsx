import React from 'react';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-md)] overflow-hidden flex flex-col w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm border-collapse min-w-[900px]">
          <thead className="bg-[var(--bg-main)] text-[var(--text-secondary)] border-b border-[var(--border)] uppercase text-[11px] font-bold tracking-widest sticky top-0 z-10">
            <tr>
              <th className="px-6 py-5 whitespace-nowrap">Vehicle Details</th>
              <th className="px-6 py-5 whitespace-nowrap">License Plate</th>
              <th className="px-6 py-5 whitespace-nowrap">Capacity</th>
              <th className="px-6 py-5 whitespace-nowrap">Odometer</th>
              <th className="px-6 py-5 whitespace-nowrap">Status</th>
              <th className="px-6 py-5 whitespace-nowrap text-right min-w-[140px]">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="divide-y divide-[var(--border)] bg-[var(--bg-surface)]"
          >
            {vehicles.length > 0 ? (
              vehicles.map((vehicle, index) => (
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
                  index={index}
                />
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center bg-[var(--bg-surface)]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-[var(--text-secondary)]"
                  >
                    <div className="w-20 h-20 rounded-full bg-[var(--bg-main)] border border-[var(--border)] flex items-center justify-center mb-5">
                      <Truck size={32} className="opacity-40" />
                    </div>
                    <p className="text-xl font-semibold text-[var(--text-primary)] mb-1">No vehicles found</p>
                    <p className="text-sm font-medium max-w-sm">Try adjusting your filters or search query to find what you're looking for.</p>
                  </motion.div>
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>

      {filteredCount > 0 ? (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-main)]/50">
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Showing <span className="font-bold text-[var(--text-primary)]">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-[var(--text-primary)]">{Math.min(currentPage * itemsPerPage, filteredCount)}</span> of{' '}
            <span className="font-bold text-[var(--text-primary)]">{filteredCount}</span> results
          </p>
          <div className="flex gap-2">
            {/* Styled pagination buttons */}
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] disabled:opacity-40 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-secondary)] disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Next Page"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
