import React, { useMemo, useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import Drawer from '../components/Drawer';
import Modal from '../components/Modal';
import VehicleDetailsDrawer from '../components/VehicleDetailsDrawer';
import VehicleFilters from '../components/VehicleFilters';
import VehicleForm from '../components/VehicleForm';
import VehicleTable from '../components/VehicleTable';
import { VEHICLE_ROLES, VEHICLE_STATUSES } from '../constants/vehicleConstants';
import useVehicleFilters from '../hooks/useVehicleFilters';
import { useFleet } from '../../../context/FleetContext';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';

export default function VehiclesPage() {
  const { vehicles, dispatch, isLoading, error } = useFleet();
  const [role, setRole] = useState(VEHICLE_ROLES.MANAGER);
  const isManager = role === VEHICLE_ROLES.MANAGER;

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ type: 'All', status: 'All' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [maintenanceAction, setMaintenanceAction] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Increased slightly for better layout

  const filteredVehicles = useVehicleFilters({ vehicles, searchQuery, filters });
  const paginatedVehicles = useMemo(
    () => filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [filteredVehicles, currentPage],
  );
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;

  const handleSaveVehicle = (formData) => {
    if (editingVehicle) {
      dispatch({
        type: 'UPDATE_VEHICLE',
        payload: {
          id: editingVehicle.id,
          patch: formData,
        },
      });
    } else {
      dispatch({
        type: 'ADD_VEHICLE',
        payload: {
          ...formData,
          status: VEHICLE_STATUSES.AVAILABLE.id,
        },
      });
    }

    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleToggleOOS = (id, setToOutOfService) => {
    dispatch({
      type: 'UPDATE_VEHICLE',
      payload: {
        id,
        patch: {
          status: setToOutOfService ? VEHICLE_STATUSES.OUT_OF_SERVICE.id : VEHICLE_STATUSES.AVAILABLE.id,
        },
      },
    });
  };

  const confirmDelete = () => {
    if (!deletingVehicle) return;
    dispatch({ type: 'DELETE_VEHICLE', payload: { id: deletingVehicle.id } });
    setDeletingVehicle(null);
  };

  const requestMaintenance = (vehicle) => {
    setMaintenanceAction({ type: 'send', vehicle });
  };

  const approveMaintenance = (vehicle) => {
    setMaintenanceAction({ type: 'approve', vehicle });
  };

  const confirmMaintenanceAction = () => {
    if (!maintenanceAction?.vehicle) return;

    const { vehicle, type } = maintenanceAction;

    dispatch({
      type: 'UPDATE_VEHICLE',
      payload: {
        id: vehicle.id,
        patch:
          type === 'send'
            ? { status: VEHICLE_STATUSES.MAINTENANCE_REQUESTED.id }
            : { status: VEHICLE_STATUSES.IN_SHOP.id, lastMaintained: new Date().toISOString().split('T')[0] },
      },
    });

    setMaintenanceAction(null);
  };

  const openAddForm = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const openEditForm = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const existingPlates = vehicles.map((vehicle) => vehicle.plate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 w-full flex flex-col gap-6 font-sans relative"
    >
      {/* Background glow specific to vehicles page if wanted, otherwise keeping it clean */}

      {isLoading && vehicles.length === 0 ? (
        <div className="mb-2">
          <Loader label="Loading fleet details…" />
        </div>
      ) : null}

      {error ? (
        <div className="mb-2">
          <ErrorMessage message={error} />
        </div>
      ) : null}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border)] mt-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] mb-1">Vehicle Registry</h1>
          <p className="text-sm font-medium text-[var(--text-secondary)]">Manage and monitor fleet assets across all regions.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-4 py-2.5 rounded-xl border border-[var(--warning)]/30 shadow-sm">
            <ShieldAlert size={16} className="text-[var(--warning)] hidden sm:block" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] hidden sm:inline mr-1">Role:</span>
            <select
              className="bg-transparent text-sm font-bold text-[var(--brand-accent)] focus:outline-none cursor-pointer appearance-none"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {Object.values(VEHICLE_ROLES).map((nextRole) => (
                <option key={nextRole} value={nextRole} className="bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium">
                  {nextRole}
                </option>
              ))}
            </select>
          </div>

          {isManager ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={openAddForm}
              className="bg-[var(--brand-accent)] text-black font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[var(--brand-accent)]/20 hover:shadow-[var(--brand-accent)]/40 transition-all duration-300"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Vehicle</span>
            </motion.button>
          ) : null}
        </div>
      </header>

      <div className="sticky top-20 z-20">
        <VehicleFilters filters={filters} setFilters={setFilters} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      <VehicleTable
        vehicles={paginatedVehicles}
        role={role}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        filteredCount={filteredVehicles.length}
        setCurrentPage={setCurrentPage}
        onEdit={openEditForm}
        onDelete={setDeletingVehicle}
        onToggleOOS={handleToggleOOS}
        onSendToMaintenance={requestMaintenance}
        onApproveMaintenance={approveMaintenance}
        onView={setViewingVehicle}
      />

      <Drawer isOpen={isFormOpen} onClose={closeForm} title={editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}>
        <VehicleForm vehicle={editingVehicle} onSave={handleSaveVehicle} onCancel={closeForm} existingPlates={existingPlates} />
      </Drawer>

      <VehicleDetailsDrawer isOpen={Boolean(viewingVehicle)} onClose={() => setViewingVehicle(null)} vehicle={viewingVehicle} />

      <Modal isOpen={Boolean(deletingVehicle)} onClose={() => setDeletingVehicle(null)} title="Remove Vehicle">
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          Are you sure you want to remove <span className="font-bold text-[var(--text-primary)]">{deletingVehicle?.name}</span> ({deletingVehicle?.plate})? This action cannot be undone and will permanently delete the vehicle record.
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)] transition-all" onClick={() => setDeletingVehicle(null)}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--danger)] text-white hover:bg-red-600 shadow-md shadow-[var(--danger)]/20 transition-all" onClick={confirmDelete}>
            Yes, Remove
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(maintenanceAction)}
        onClose={() => setMaintenanceAction(null)}
        title={maintenanceAction?.type === 'approve' ? 'Maintenance Approval' : 'Send to Maintenance'}
      >
        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
          {maintenanceAction?.type === 'approve' ? (
            <>
              Approve maintenance request for <span className="font-bold text-[var(--text-primary)]">{maintenanceAction?.vehicle?.name}</span> ({maintenanceAction?.vehicle?.plate})? It will be moved to <span className="font-semibold text-[var(--warning)]">In Shop</span>.
            </>
          ) : (
            <>
              Send <span className="font-bold text-[var(--text-primary)]">{maintenanceAction?.vehicle?.name}</span> ({maintenanceAction?.vehicle?.plate}) for maintenance? It will be marked as <span className="font-semibold text-[var(--warning)]">Maintenance Requested</span>.
            </>
          )}
        </p>
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <button className="px-4 py-2 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-[var(--text-primary)] transition-all" onClick={() => setMaintenanceAction(null)}>
            Cancel
          </button>
          <button className={`px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${maintenanceAction?.type === 'approve' ? 'bg-[var(--success)] hover:bg-green-600 shadow-[var(--success)]/20' : 'bg-[var(--warning)] hover:bg-yellow-600 shadow-[var(--warning)]/20'}`} onClick={confirmMaintenanceAction}>
            {maintenanceAction?.type === 'approve' ? 'Approve' : 'Send'}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}
