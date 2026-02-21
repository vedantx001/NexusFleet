import React, { useMemo, useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
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
  const itemsPerPage = 5;

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
    <div className="flex-1 overflow-auto p-4 sm:p-8 bg-[var(--bg-main)] text-[var(--text-primary)]">
      {isLoading && vehicles.length === 0 ? (
        <div className="mb-6">
          <Loader label="Loading vehicles…" />
        </div>
      ) : null}
      {error ? (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Vehicle Registry</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage and monitor fleet assets across all regions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--bg-surface)] px-3 py-2 rounded border border-[var(--warning)]/30">
            <ShieldAlert size={14} className="text-[var(--warning)] hidden sm:block" />
            <span className="text-xs font-semibold text-[var(--text-secondary)] hidden sm:inline">Mock Role:</span>
            <select
              className="bg-transparent text-sm font-bold text-[var(--brand-primary)] focus:outline-none cursor-pointer"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {Object.values(VEHICLE_ROLES).map((nextRole) => (
                <option key={nextRole} value={nextRole}>
                  {nextRole}
                </option>
              ))}
            </select>
          </div>

          {isManager ? (
            <button onClick={openAddForm} className="btn-primary flex items-center gap-2 shadow-[var(--shadow-md)]">
              <Plus size={18} /> Add Vehicle
            </button>
          ) : null}
        </div>
      </div>

      <VehicleFilters filters={filters} setFilters={setFilters} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Are you sure you want to remove{' '}
          <span className="font-bold text-[var(--text-primary)]">
            {deletingVehicle?.name} ({deletingVehicle?.plate})
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setDeletingVehicle(null)}>
            Cancel
          </button>
          <button className="btn-primary !bg-[var(--danger)] hover:!bg-red-700" onClick={confirmDelete}>
            Yes, Remove
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(maintenanceAction)}
        onClose={() => setMaintenanceAction(null)}
        title={maintenanceAction?.type === 'approve' ? 'Maintenance Approval' : 'Send to Maintenance'}
      >
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          {maintenanceAction?.type === 'approve' ? (
            <>
              Approve maintenance for{' '}
              <span className="font-bold text-[var(--text-primary)]">
                {maintenanceAction?.vehicle?.name} ({maintenanceAction?.vehicle?.plate})
              </span>
              ? The vehicle will be moved to <span className="font-semibold text-[var(--text-primary)]">In Shop</span>.
            </>
          ) : (
            <>
              Send{' '}
              <span className="font-bold text-[var(--text-primary)]">
                {maintenanceAction?.vehicle?.name} ({maintenanceAction?.vehicle?.plate})
              </span>{' '}
              for maintenance? This will mark the vehicle as <span className="font-semibold text-[var(--text-primary)]">Maintenance Requested</span>.
            </>
          )}
        </p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={() => setMaintenanceAction(null)}>
            Cancel
          </button>
          <button className="btn-primary" onClick={confirmMaintenanceAction}>
            {maintenanceAction?.type === 'approve' ? 'Approve' : 'Send'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
