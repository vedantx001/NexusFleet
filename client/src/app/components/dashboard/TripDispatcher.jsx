import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle2, Plus, Truck, User, X, Package } from 'lucide-react';
import { useFleet } from './fleetStore';
import ModalForm from '../../../components/forms/ModalForm';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { VEHICLE_STATUSES } from '../../../features/vehicles/constants/vehicleConstants';
import { isLicenseExpired } from '../../../context/FleetContext';

function StatusBadge({ status }) {
  const styleMap = {
    Draft: {
      text: 'text-(--text-secondary)',
      dot: 'bg-(--text-secondary)',
      border: 'border-(--border)',
      bg: 'bg-(--bg-main)',
    },
    Dispatched: {
      text: 'text-(--info)',
      dot: 'bg-(--info)',
      border: 'border-(--info)',
      bg: 'bg-(--bg-main)',
    },
    Completed: {
      text: 'text-(--success)',
      dot: 'bg-(--success)',
      border: 'border-(--success)',
      bg: 'bg-(--bg-main)',
    },
    Cancelled: {
      text: 'text-(--danger)',
      dot: 'bg-(--danger)',
      border: 'border-(--danger)',
      bg: 'bg-(--bg-main)',
    },
  };

  const styles = styleMap[status] || styleMap.Draft;

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${styles.bg} ${styles.border} ${styles.text} shadow-sm`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} shadow-[0_0_10px_currentColor]`} />
      {status}
    </motion.span>
  );
}

function TripLifecycle({ status }) {
  const steps = ['Draft', 'Dispatched', 'Completed'];

  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-2 mt-4 sm:mt-0 opacity-80 bg-(--danger)/10 border border-(--danger)/20 px-3 py-1.5 rounded-lg w-max">
        <span className="w-2.5 h-2.5 rounded-full bg-(--danger) shadow-[0_0_8px_var(--danger)]" />
        <span className="text-xs font-bold text-(--danger) uppercase tracking-wider">Trip Cancelled</span>
      </div>
    );
  }

  const currentIndex = steps.indexOf(status) >= 0 ? steps.indexOf(status) : 0;

  return (
    <div className="flex items-center w-full sm:w-auto mt-4 sm:mt-0 min-w-[200px]">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isPast = index < currentIndex;
        const isLast = index === steps.length - 1;

        let colorClass = 'bg-(--bg-main) border-(--border) text-(--text-secondary)';
        let lineClass = 'bg-(--border)';
        if (isActive) {
          colorClass = 'bg-(--brand-accent) border-(--brand-accent) text-black shadow-[0_0_10px_var(--brand-accent)]';
        } else if (isPast) {
          colorClass = 'bg-(--success) border-(--success) text-white shadow-[0_0_10px_var(--success)]';
          lineClass = 'bg-(--success)';
        }

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative z-10 gap-1.5">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${colorClass}`}>
                {isPast ? <CheckCircle2 size={10} strokeWidth={3} /> : index + 1}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider absolute top-6 whitespace-nowrap transition-colors duration-300 ${isActive || isPast ? 'text-(--text-primary)' : 'text-(--text-secondary) opacity-50'}`}>
                {step === 'Dispatched' ? 'In Progress' : step}
              </span>
            </div>
            {!isLast && (
              <div className="flex-1 h-0.5 mx-1.5 overflow-hidden">
                <div className={`h-full w-full transition-all duration-500 ease-out ${lineClass}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TripRow({ trip, vehicle, driver, onRequestComplete, index }) {
  const { dispatch } = useFleet();

  const canDispatch = trip.status?.trim().toLowerCase() === 'draft';
  const canComplete = trip.status?.trim().toLowerCase() === 'dispatched';
  const canCancel = trip.status === 'Draft' || trip.status === 'Dispatched';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.005 }}
      className="group flex flex-col p-5 sm:p-6 rounded-2xl bg-(--bg-surface) border border-(--border) hover:border-(--brand-accent)/50 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* TOP: Route & Lifecycle */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-5 border-b border-(--border) pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h4 className="text-lg font-bold text-(--text-primary) flex items-center gap-2">
              HQ <ArrowRight size={16} className="text-(--text-secondary)" /> {trip.destination}
            </h4>
            <StatusBadge status={trip.status} />
          </div>
          <p className="text-[10px] font-bold text-(--text-secondary) uppercase tracking-wider">Trip ID: {trip.id}</p>
        </div>

        <TripLifecycle status={trip.status} />
      </div>

      {/* MIDDLE: Operational Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-start gap-3 bg-(--bg-main) p-3 rounded-xl border border-(--border) group-hover:bg-(--bg-surface) transition-colors">
          <div className="p-2 rounded-lg bg-(--bg-surface) border border-(--border) text-(--text-secondary) group-hover:border-(--brand-accent)/30 group-hover:text-(--brand-accent) transition-colors"><Truck size={16} /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-(--text-secondary)">Vehicle</p>
            <p className="text-sm font-semibold text-(--text-primary)">{vehicle ? vehicle.label : 'Pending Assignment'}</p>
            {vehicle && <p className="text-xs text-(--text-secondary) font-medium">{vehicle.maxCapacity || vehicle.capacity}kg max cap</p>}
          </div>
        </div>
        <div className="flex items-start gap-3 bg-(--bg-main) p-3 rounded-xl border border-(--border) group-hover:bg-(--bg-surface) transition-colors">
          <div className="p-2 rounded-lg bg-(--bg-surface) border border-(--border) text-(--text-secondary) group-hover:border-(--brand-accent)/30 group-hover:text-(--brand-accent) transition-colors"><User size={16} /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-(--text-secondary)">Driver</p>
            <p className="text-sm font-semibold text-(--text-primary)">{driver ? driver.name : 'Unassigned'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-(--bg-main) p-3 rounded-xl border border-(--border) group-hover:bg-(--bg-surface) transition-colors">
          <div className="p-2 rounded-lg bg-(--bg-surface) border border-(--border) text-(--text-secondary) group-hover:border-(--brand-accent)/30 group-hover:text-(--brand-accent) transition-colors"><Package size={16} /></div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-(--text-secondary)">Cargo Info</p>
            <p className="text-sm font-semibold text-(--text-primary)">{trip.cargo}</p>
            {typeof trip.cargoWeight === 'number' && <p className="text-xs text-(--text-secondary) font-medium">{trip.cargoWeight}kg load</p>}
          </div>
        </div>
      </div>

      {/* BOTTOM: Schedule & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto border-t border-(--border) pt-4">
        <div className="flex gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-(--text-secondary) mb-1">Schedule</p>
            <p className="text-sm font-medium text-(--text-primary)">Immediate Start</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-(--text-secondary) mb-1">Est. Completion</p>
            <p className="text-sm font-medium text-(--text-primary)">To Be Determined</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <AnimatePresence mode="popLayout">
            {canDispatch ? (
              <motion.button
                key="dispatch"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => dispatch({ type: 'DISPATCH_TRIP', payload: { id: trip.id } })}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--brand-accent) text-black font-bold text-sm shadow-md hover:shadow-[0_0_15px_var(--brand-accent)] transition-all"
              >
                Dispatch <ArrowRight size={16} strokeWidth={2.5} />
              </motion.button>
            ) : null}

            {canComplete ? (
              <motion.button
                key="complete"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => onRequestComplete?.(trip, vehicle)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-(--success) text-white font-bold text-sm shadow-md hover:shadow-[0_0_15px_var(--success)] transition-all"
              >
                Complete <CheckCircle2 size={16} strokeWidth={2.5} />
              </motion.button>
            ) : null}

            {canCancel ? (
              <motion.button
                key="cancel"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                type="button"
                onClick={() => dispatch({ type: 'CANCEL_TRIP', payload: { id: trip.id } })}
                className="p-2.5 rounded-xl bg-(--bg-main) text-(--text-secondary) hover:bg-(--danger)/10 hover:text-(--danger) hover:border-(--danger)/50 transition-colors border border-(--border)"
                aria-label={`Cancel ${trip.id}`}
              >
                <X size={16} strokeWidth={2.5} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function TripDispatcher() {
  const { trips, dispatch, vehicles, drivers, isLoading, error: fleetError } = useFleet();

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
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (vehicleId && vehiclesById[vehicleId]?.status === VEHICLE_STATUSES.AVAILABLE.id) return;
    setVehicleId(availableVehicles[0]?.id || '');
  }, [availableVehicles, vehicleId, vehiclesById]);

  const parsedWeight = cargoWeight === '' ? NaN : Number(cargoWeight);
  const selectedVehicle = vehicleId ? vehiclesById[vehicleId] : undefined;
  const maxCapacity = selectedVehicle?.capacity || selectedVehicle?.maxCapacity;
  const isWeightValid = Number.isFinite(parsedWeight) && parsedWeight > 0;
  const isCapacityOk = isWeightValid && typeof maxCapacity === 'number' ? parsedWeight <= maxCapacity : true;

  const compliantDrivers = useMemo(() => {
    if (!selectedVehicle?.type) return availableDrivers;
    return availableDrivers.filter((d) => Array.isArray(d.licenseCategories) && d.licenseCategories.includes(selectedVehicle.type));
  }, [availableDrivers, selectedVehicle?.type]);

  useEffect(() => {
    const isSelectedCompliant = compliantDrivers.some((d) => String(d.id) === String(driverId));
    if (driverId && isSelectedCompliant) return;
    setDriverId(compliantDrivers[0]?.id || '');
  }, [compliantDrivers, driverId]);

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
    setFormError('');

    if (!vehicleId || !driverId) {
      setFormError('Select an available vehicle and driver.');
      return;
    }

    if (!isWeightValid) {
      setFormError('Enter a valid cargo weight.');
      return;
    }

    if (maxCapacity && parsedWeight > maxCapacity) {
      setFormError(`Cargo weight exceeds max capacity (${maxCapacity}kg).`);
      return;
    }

    const selectedDriver = driverId ? driversById[driverId] : undefined;
    if (selectedDriver) {
      if (isLicenseExpired(selectedDriver.licenseExpiryDate)) {
        setFormError('Driver license is expired.');
        return;
      }
      if (selectedVehicle?.type && (!Array.isArray(selectedDriver.licenseCategories) || !selectedDriver.licenseCategories.includes(selectedVehicle.type))) {
        setFormError(`Driver is not licensed for ${selectedVehicle.type} category.`);
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
    <div className="flex flex-col gap-8 w-full relative h-full">
      {isLoading && trips.length === 0 ? <Loader label="Crunching dispatch data…" /> : null}
      {fleetError ? <ErrorMessage message={fleetError} /> : null}

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-(--border) pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-(--text-primary) mb-2">Trip Dispatcher</h1>
          <p className="text-sm font-medium text-(--text-secondary)">
            Assign vehicles, manage routes, and monitor trip lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-semibold text-(--text-secondary) bg-(--bg-surface) border border-(--border) rounded-xl px-4 py-2.5 shadow-sm hidden md:block">
            <span className="text-(--success)">{availableVehicles.length}</span> Vehicles Ready •{' '}
            <span className="text-(--info)">{availableDrivers.length}</span> Drivers Available
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              setFormError('');
              setIsCreateOpen((v) => !v);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${isCreateOpen
                ? 'bg-(--bg-main) border border-(--border) text-(--text-primary) hover:border-(--danger)/50 hover:bg-(--danger)/10 hover:text-(--danger)'
                : 'bg-(--brand-accent) text-black border border-transparent hover:shadow-[0_0_20px_var(--brand-accent)]'
              }`}
          >
            {isCreateOpen ? <X size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
            {isCreateOpen ? 'Cancel Draft' : 'Create Trip'}
          </motion.button>
        </div>
      </header>

      {/* Main 2-Column Operational Layout */}
      <div className="flex flex-col xl:flex-row gap-8 items-start relative pb-10">

        {/* LEFT PANEL: Trip Creation Form */}
        <AnimatePresence mode="popLayout">
          {isCreateOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: '100%' }}
              exit={{ opacity: 0, x: -20, width: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="xl:w-[40%] shrink-0 overflow-hidden"
            >
              <div className="bg-(--bg-surface) border border-(--border) rounded-2xl shadow-(--shadow-md) p-6 sm:p-8 w-full">
                <h3 className="text-lg font-bold text-(--text-primary) mb-6 flex items-center gap-2 pb-4 border-b border-(--border)">
                  <Plus className="text-(--brand-accent)" size={20} strokeWidth={2.5} /> Create & Assign Trip
                </h3>

                <form onSubmit={onCreateTrip} className="space-y-6">
                  {/* Section 1: Trip Details */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-(--text-secondary) bg-(--bg-main) border border-(--border) shadow-[0_2px_4px_rgba(0,0,0,0.2)] py-1.5 px-3 rounded-lg w-max">
                      1. Trip Details
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block">Origin</label>
                        <input disabled value="HQ Dispatch Center" className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-secondary) opacity-60 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block" htmlFor="dest">Destination <span className="text-(--danger)">*</span></label>
                        <input id="dest" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Northern Hub" autoFocus className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:border-(--brand-accent) focus:ring-1 focus:ring-(--brand-accent) transition-all shadow-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block" htmlFor="cargo">Cargo Type <span className="text-(--danger)">*</span></label>
                        <input id="cargo" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="e.g. Electronics" className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-primary) placeholder:text-(--text-secondary) focus:outline-none focus:border-(--brand-accent) focus:ring-1 focus:ring-(--brand-accent) transition-all shadow-sm" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block">Est. Distance</label>
                        <input disabled value="Auto-Calculated" className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-secondary) opacity-60 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Assignment */}
                  <div className="space-y-4 pt-6 border-t border-(--border)">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] tracking-widest uppercase font-bold text-(--text-secondary) bg-(--bg-main) border border-(--border) shadow-[0_2px_4px_rgba(0,0,0,0.2)] py-1.5 px-3 rounded-lg w-max">
                        2. Assignment
                      </h4>
                      {isWeightValid && !isCapacityOk && (
                        <div className="flex flex-row items-center gap-1 text-[10px] font-bold text-(--danger) bg-(--danger)/10 border border-(--danger)/20 px-2.5 py-1 rounded shadow-sm">
                          <AlertTriangle size={12} /> Exceeds vehicle limits
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block" htmlFor="weight">Cargo Weight (kg) <span className="text-(--danger)">*</span></label>
                      <input id="weight" type="number" min={1} value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} placeholder={maxCapacity ? `Max limit: ${maxCapacity} kg` : 'Enter weight'} className={`w-full rounded-xl border bg-(--bg-main) px-4 py-3 text-sm font-bold text-(--text-primary) placeholder:font-medium placeholder:text-(--text-secondary) focus:outline-none focus:ring-1 transition-all shadow-sm ${isWeightValid && !isCapacityOk ? 'border-(--danger) focus:border-(--danger) focus:ring-(--danger)' : 'border-(--border) focus:border-(--brand-accent) focus:ring-(--brand-accent)'}`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block" htmlFor="vehicle">Vehicle <span className="text-(--danger)">*</span></label>
                        <select id="vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} disabled={availableVehicles.length === 0} className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-semibold text-(--text-primary) focus:outline-none focus:border-(--brand-accent) focus:ring-1 focus:ring-(--brand-accent) transition-all shadow-sm disabled:opacity-50 appearance-none cursor-pointer">
                          {availableVehicles.length === 0 ? <option value="">None Available</option> : null}
                          {availableVehicles.map((v) => (
                            <option key={v.id} value={v.id}>{v.name || v.label} — {v.capacity || v.maxCapacity}kg</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block" htmlFor="driver">Driver <span className="text-(--danger)">*</span></label>
                        <select id="driver" value={driverId} onChange={(e) => setDriverId(e.target.value)} disabled={compliantDrivers.length === 0} className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-semibold text-(--text-primary) focus:outline-none focus:border-(--brand-accent) focus:ring-1 focus:ring-(--brand-accent) transition-all shadow-sm disabled:opacity-50 appearance-none cursor-pointer">
                          {compliantDrivers.length === 0 ? <option value="">None Available</option> : null}
                          {compliantDrivers.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Schedule */}
                  <div className="space-y-4 pt-6 border-t border-(--border)">
                    <h4 className="text-[10px] tracking-widest uppercase font-bold text-(--text-secondary) bg-(--bg-main) border border-(--border) shadow-[0_2px_4px_rgba(0,0,0,0.2)] py-1.5 px-3 rounded-lg w-max">
                      3. Schedule
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block">Start Date</label>
                        <input disabled value="Immediate (Upon Dispatch)" className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-secondary) opacity-60 cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-(--text-secondary) uppercase tracking-wider mb-2 block">Expected Completion</label>
                        <input disabled value="TBD" className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3 text-sm font-medium text-(--text-secondary) opacity-60 cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 mt-6 border-t border-(--border)">
                    <AnimatePresence mode="popLayout">
                      {formError && (
                        <motion.div initial={{ opacity: 0, height: 0, mb: 0 }} animate={{ opacity: 1, height: 'auto', mb: 16 }} exit={{ opacity: 0, height: 0, mb: 0 }} className="p-3.5 rounded-xl bg-(--danger)/10 border border-(--danger)/30 text-sm font-bold text-(--danger) flex items-center gap-3 shadow-sm">
                          <AlertTriangle size={18} className="shrink-0" />
                          <span>{formError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      whileHover={canCreate ? { scale: 1.01 } : {}}
                      whileTap={canCreate ? { scale: 0.99 } : {}}
                      type="submit"
                      disabled={!canCreate}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] transition-all duration-300 ${canCreate
                          ? 'bg-(--brand-accent) text-black hover:shadow-[0_4px_20px_var(--brand-accent)]'
                          : 'bg-(--bg-main) text-(--text-secondary) border border-(--border) opacity-50 cursor-not-allowed'
                        }`}
                    >
                      {canCreate ? <Plus size={20} strokeWidth={2.5} /> : null}
                      {canCreate ? 'Confirm & Create Trip' : 'Awaiting Details...'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT PANEL: Active Trips */}
        <div className={`flex-1 transition-all duration-500 w-full ${isCreateOpen ? 'xl:w-[60%]' : 'xl:w-full'}`}>
          <div className="bg-(--bg-surface) border border-(--border) rounded-2xl p-6 shadow-(--shadow-md) min-h-[500px]">
            <h3 className="text-lg font-bold text-(--text-primary) mb-6 flex items-center gap-3 pb-4 border-b border-(--border)">
              <span className="w-2.5 h-2.5 rounded-full bg-(--success) shadow-[0_0_10px_var(--success)]" /> Active Dispatch Queue
            </h3>

            <div className="relative">
              <AnimatePresence mode="popLayout">
                {trips.length > 0 ? (
                  <div className="space-y-5">
                    {trips.map((trip, idx) => (
                      <TripRow
                        key={trip.id}
                        index={idx}
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
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 text-(--text-secondary)">
                    <div className="w-20 h-20 rounded-full bg-(--bg-main) border border-(--border) flex items-center justify-center mb-6 shadow-sm">
                      <Truck size={36} className="opacity-20" />
                    </div>
                    <h3 className="text-xl font-bold text-(--text-primary) mb-2">No Active Trips</h3>
                    <p className="text-sm font-medium max-w-sm text-center">Create a new trip to begin dispatching vehicles to their destinations.</p>
                    {!isCreateOpen && (
                      <button onClick={() => setIsCreateOpen(true)} className="mt-8 px-5 py-2.5 rounded-xl border border-(--border) font-bold text-sm text-(--text-primary) hover:bg-(--bg-main) transition-colors">
                        Create First Trip
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Complete Trip Modal */}
      <ModalForm
        open={Boolean(completeTripId)}
        title="Complete Trip Entry"
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
        submitLabel="Mark as Completed"
      >
        <div className="space-y-6 pt-2">
          <AnimatePresence>
            {completeError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-(--danger)/10 border border-(--danger)/30 rounded-xl text-sm text-(--danger) font-bold flex items-center gap-2">
                <AlertTriangle size={16} /> {completeError}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-(--text-secondary) mb-2" htmlFor="finalOdo">
              Final Odometer Reading (km) <span className="text-(--danger)">*</span>
            </label>
            <input
              id="finalOdo"
              type="number"
              min={0}
              className="w-full rounded-xl border border-(--border) bg-(--bg-main) px-4 py-3.5 text-sm font-bold text-(--text-primary) transition-all duration-200 outline-none focus:border-(--brand-accent) focus:ring-1 focus:ring-(--brand-accent) shadow-sm placeholder:font-medium placeholder:text-(--text-secondary)"
              value={finalOdometer}
              onChange={(e) => setFinalOdometer(e.target.value)}
              placeholder="Enter current reading"
              required
            />
            <p className="text-xs font-semibold text-(--text-secondary) mt-2 opacity-70 flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Ensuring accuracy of telemetry
            </p>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
