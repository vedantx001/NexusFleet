import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle2, Plus, Truck, User, X } from 'lucide-react';
import { useFleet } from './fleetStore';
import ModalForm from '../../../components/forms/ModalForm';
import { VEHICLE_STATUSES } from '../../../features/vehicles/constants/vehicleConstants';
import { isLicenseExpired } from '../../../context/FleetContext';

function StatusBadge({ status }) {
  const styleMap = {
    Draft: {
      text: 'text-[var(--text-secondary)]',
      dot: 'bg-[var(--text-secondary)]',
      border: 'border-[var(--border)]',
      bg: 'bg-[var(--bg-main)]',
    },
    Dispatched: {
      text: 'text-[var(--info)]',
      dot: 'bg-[var(--info)]',
      border: 'border-[var(--info)]',
      bg: 'bg-[var(--bg-main)]',
    },
    Completed: {
      text: 'text-[var(--success)]',
      dot: 'bg-[var(--success)]',
      border: 'border-[var(--success)]',
      bg: 'bg-[var(--bg-main)]',
    },
    Cancelled: {
      text: 'text-[var(--danger)]',
      dot: 'bg-[var(--danger)]',
      border: 'border-[var(--danger)]',
      bg: 'bg-[var(--bg-main)]',
    },
  };

  const styles = styleMap[status] || styleMap.Draft;

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} shadow-[0_0_10px_currentColor]`} />
      {status}
    </motion.span>
  );
}

function TripRow({ trip, vehicle, driver, onRequestComplete }) {
  const { dispatch } = useFleet();

  const canDispatch = trip.status?.trim().toLowerCase() === 'draft';
  const canComplete = trip.status?.trim().toLowerCase() === 'dispatched';
  const canCancel = trip.status === 'Draft' || trip.status === 'Dispatched';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
      className="group flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-5 rounded-xl bg-(--bg-surface) border border-(--border) hover:border-(--brand-accent) hover:shadow-(--shadow-md) transition-all duration-300"
    >
      <div className="flex items-start gap-6">
        <div className="w-12 h-12 rounded-full bg-(--bg-main) border border-(--border) flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5 text-(--text-secondary) group-hover:text-(--brand-accent) transition-colors" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h4 className="text-base font-semibold text-(--text-primary)">{trip.id}</h4>
            <StatusBadge status={trip.status} />
          </div>

          <p className="text-sm text-(--text-secondary) flex flex-wrap items-center gap-2">
            <span className="font-medium text-(--text-primary)">{trip.cargo}</span>
            <span className="w-1 h-1 rounded-full bg-(--border)" />
            <span className="truncate">{trip.destination}</span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-(--text-secondary)">
            <span className="inline-flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              {vehicle ? `${vehicle.label} • ${vehicle.maxCapacity}kg cap` : 'Vehicle —'}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {driver ? driver.name : 'Driver —'}
            </span>
            {typeof trip.cargoWeight === 'number' ? <span>{trip.cargoWeight}kg cargo</span> : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <AnimatePresence mode="popLayout">
          {canDispatch ? (
            <motion.button
              key="dispatch"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              onClick={() => dispatch({ type: 'DISPATCH_TRIP', payload: { id: trip.id } })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--brand-primary) text-(--bg-surface) font-medium text-sm hover:bg-(--brand-primary-hover) transition-all"
            >
              Dispatch <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : null}

          {canComplete ? (
            <motion.button
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              onClick={() => onRequestComplete?.(trip, vehicle)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--success) text-white font-medium text-sm hover:opacity-95 transition-opacity"
            >
              Complete <CheckCircle2 className="w-4 h-4" />
            </motion.button>
          ) : null}

          {canCancel ? (
            <motion.button
              key="cancel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: { id: trip.id } })}
              className="p-2 rounded-lg bg-(--bg-main) text-(--text-secondary) hover:text-(--danger) transition-colors border border-(--border)"
              aria-label={`Cancel ${trip.id}`}
            >
              <X className="w-4 h-4" />
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function TripDispatcher() {
  const { trips, dispatch, vehicles, drivers } = useFleet();

  const availableVehicles = useMemo(() => vehicles.filter((v) => v.status === VEHICLE_STATUSES.AVAILABLE.id), [vehicles]);
  const availableDrivers = useMemo(() => drivers.filter((d) => d.status === 'Available' && !isLicenseExpired(d.licenseExpiryDate)), [drivers]);

  const vehiclesById = useMemo(() => Object.fromEntries(vehicles.map((v) => [v.id, v])), [vehicles]);
  const driversById = useMemo(() => Object.fromEntries(drivers.map((d) => [d.id, d])), [drivers]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [completeTripId, setCompleteTripId] = useState('');
  const [finalOdometer, setFinalOdometer] = useState('');
  const [completeError, setCompleteError] = useState('');

  const [destination, setDestination] = useState('');
  const [cargo, setCargo] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [vehicleId, setVehicleId] = useState(availableVehicles[0]?.id || '');
  const [driverId, setDriverId] = useState(availableDrivers[0]?.id || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicleId && vehiclesById[vehicleId]?.status === VEHICLE_STATUSES.AVAILABLE.id) return;
    setVehicleId(availableVehicles[0]?.id || '');
  }, [availableVehicles, vehicleId, vehiclesById]);

  useEffect(() => {
    const isSelectedCompliant = compliantDrivers.some((d) => String(d.id) === String(driverId));
    if (driverId && isSelectedCompliant) return;
    setDriverId(compliantDrivers[0]?.id || '');
  }, [compliantDrivers, driverId]);

  const parsedWeight = cargoWeight === '' ? NaN : Number(cargoWeight);
  const selectedVehicle = vehicleId ? vehiclesById[vehicleId] : undefined;
  const maxCapacity = selectedVehicle?.capacity;
  const isWeightValid = Number.isFinite(parsedWeight) && parsedWeight > 0;
  const isCapacityOk = isWeightValid && typeof maxCapacity === 'number' ? parsedWeight <= maxCapacity : true;

  const compliantDrivers = useMemo(() => {
    if (!selectedVehicle?.type) return availableDrivers;
    return availableDrivers.filter((d) => Array.isArray(d.licenseCategories) && d.licenseCategories.includes(selectedVehicle.type));
  }, [availableDrivers, selectedVehicle?.type]);

  const canCreate =
    destination.trim().length > 0 &&
    cargo.trim().length > 0 &&
    isWeightValid &&
    isCapacityOk &&
    vehicleId &&
    driverId &&
    availableVehicles.length > 0 &&
    compliantDrivers.length > 0;

  const onCreateTrip = (e) => {
    e.preventDefault();
    setError('');

    if (!vehicleId || !driverId) {
      setError('Select an available vehicle and driver.');
      return;
    }

    if (!isWeightValid) {
      setError('Enter a valid cargo weight.');
      return;
    }

    if (selectedVehicle && typeof selectedVehicle.maxCapacity === 'number' && parsedWeight > selectedVehicle.maxCapacity) {
      // Legacy field guard (old demo vehicles had maxCapacity).
      setError(`Cargo weight exceeds max capacity (${selectedVehicle.maxCapacity}kg).`);
      return;
    }

    if (selectedVehicle && typeof selectedVehicle.capacity === 'number' && parsedWeight > selectedVehicle.capacity) {
      setError(`Cargo weight exceeds max capacity (${selectedVehicle.capacity}kg).`);
      return;
    }

    const selectedDriver = driverId ? driversById[driverId] : undefined;
    if (selectedDriver) {
      if (isLicenseExpired(selectedDriver.licenseExpiryDate)) {
        setError('Driver license is expired.');
        return;
      }
      if (selectedVehicle?.type && (!Array.isArray(selectedDriver.licenseCategories) || !selectedDriver.licenseCategories.includes(selectedVehicle.type))) {
        setError(`Driver is not licensed for ${selectedVehicle.type} category.`);
        return;
      }
    }

    dispatch({
      type: 'CREATE_TRIP',
      payload: {
        destination: destination.trim(),
        cargo: cargo.trim(),
        cargoWeight: parsedWeight,
        vehicleId,
        driverId,
      },
    });

    setDestination('');
    setCargo('');
    setCargoWeight('');
    setIsCreateOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 shadow-(--shadow-md)"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-(--text-primary)">Trip Dispatcher</h2>
          <p className="text-sm text-(--text-secondary) mt-1">
            Create and manage trips from Draft → Dispatched → Completed / Cancelled.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-(--text-secondary) bg-(--bg-main) border border-(--border) rounded-xl px-3 py-2">
            Available: <span className="font-semibold text-(--text-primary)">{availableVehicles.length}</span> vehicles •{' '}
            <span className="font-semibold text-(--text-primary)">{availableDrivers.length}</span> licensed drivers
          </div>

          <button
            type="button"
            onClick={() => {
              setError('');
              setIsCreateOpen((v) => !v);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-(--bg-main) border border-(--border) text-(--text-primary) font-medium text-sm hover:border-(--brand-accent) hover:text-(--brand-accent) transition-all"
          >
            {isCreateOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isCreateOpen ? 'Close' : 'New Trip'}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false} mode="popLayout">
        {isCreateOpen ? (
          <motion.form
            key="create-form"
            onSubmit={onCreateTrip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-(--border) bg-(--bg-main) p-4 md:p-5 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider" htmlFor="dest">
                  Destination
                </label>
                <input
                  id="dest"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Point B (e.g. Northern Hub)"
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--bg-surface) px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--brand-accent)"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider" htmlFor="cargo">
                  Cargo
                </label>
                <input
                  id="cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Goods type"
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--bg-surface) px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--brand-accent)"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider" htmlFor="weight">
                  Cargo Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  min={1}
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  placeholder={maxCapacity ? `≤ ${maxCapacity}` : 'Enter weight'}
                  className={`mt-2 w-full rounded-xl border bg-(--bg-surface) px-3 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:ring-2 focus:ring-(--brand-accent) ${
                    isWeightValid && !isCapacityOk ? 'border-(--danger)' : 'border-(--border)'
                  }`}
                />
                {isWeightValid && !isCapacityOk ? (
                  <p className="mt-2 text-xs text-(--danger)">Max capacity is {maxCapacity}kg for the selected vehicle.</p>
                ) : null}
              </div>

              <div>
                <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider" htmlFor="vehicle">
                  Vehicle
                </label>
                <select
                  id="vehicle"
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--bg-surface) px-3 py-2.5 text-sm text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand-accent)"
                  disabled={availableVehicles.length === 0}
                >
                  {availableVehicles.length === 0 ? <option value="">No vehicles available</option> : null}
                  {availableVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name || v.label} ({typeof v.capacity === 'number' ? v.capacity : v.maxCapacity}kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider" htmlFor="driver">
                  Driver
                </label>
                <select
                  id="driver"
                  value={driverId}
                  onChange={(e) => setDriverId(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-(--border) bg-(--bg-surface) px-3 py-2.5 text-sm text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--brand-accent)"
                  disabled={compliantDrivers.length === 0}
                >
                  {compliantDrivers.length === 0 ? <option value="">No licensed drivers available</option> : null}
                  {compliantDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {selectedVehicle?.type ? (
                  <p className="mt-2 text-xs text-(--text-secondary)">
                    License required: <span className="font-semibold text-(--text-primary)">{selectedVehicle.type}</span>
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
              <AnimatePresence>
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="inline-flex items-center gap-2 text-sm text-(--danger)"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{error}</span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="flex items-center gap-3 justify-end">
                <button
                  type="submit"
                  disabled={!canCreate}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-all ${
                    canCreate
                      ? 'bg-(--brand-accent) text-black border-transparent hover:bg-(--brand-accent-hover)'
                      : 'bg-(--bg-surface) text-(--text-secondary) border-(--border) opacity-70 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Create Trip
                </button>
              </div>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence mode="popLayout">
          {trips.length > 0 ? (
            <div className="space-y-4">
              {trips.map((trip) => (
                <TripRow
                  key={trip.id}
                  trip={trip}
                  vehicle={trip.vehicleId ? vehiclesById[trip.vehicleId] : undefined}
                  driver={trip.driverId ? driversById[trip.driverId] : undefined}
                  onRequestComplete={(nextTrip, nextVehicle) => {
                    setCompleteError('');
                    setCompleteTripId(nextTrip?.id || '');
                    const prefill = nextVehicle?.odometer;
                    setFinalOdometer(typeof prefill === 'number' ? String(prefill) : '');
                  }}
                />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-(--text-secondary)">
              No operations found. Create a trip to begin.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ModalForm
        open={Boolean(completeTripId)}
        title="Complete Trip"
        onClose={() => {
          setCompleteTripId('');
          setFinalOdometer('');
          setCompleteError('');
        }}
        onSubmit={(event) => {
          event.preventDefault();
          setCompleteError('');

          const numeric = finalOdometer === '' ? NaN : Number(finalOdometer);
          if (!Number.isFinite(numeric) || numeric < 0) {
            setCompleteError('Enter a valid final odometer reading.');
            return;
          }

          dispatch({ type: 'COMPLETE_TRIP', payload: { id: completeTripId, endOdometer: numeric } });
          setCompleteTripId('');
          setFinalOdometer('');
        }}
        submitLabel="Mark Done"
      >
        {completeError ? (
          <div className="p-4 mb-2 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] rounded-xl text-sm text-[var(--danger)] font-medium">
            {completeError}
          </div>
        ) : null}

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-1" htmlFor="finalOdo">
            Final Odometer (km)
          </label>
          <input
            id="finalOdo"
            type="number"
            min={0}
            className="mt-2 w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary transition-all duration-200 outline-none focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] shadow-sm-token"
            value={finalOdometer}
            onChange={(e) => setFinalOdometer(e.target.value)}
            required
          />
        </div>
      </ModalForm>
    </motion.div>
  );
}
