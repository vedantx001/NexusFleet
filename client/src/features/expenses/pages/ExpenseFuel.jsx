import React, { useMemo, useState } from 'react';
import DataTable from '../../../components/table/DataTable';
import ModalForm from '../../../components/forms/ModalForm';
import { useFleet } from '../../../context/FleetContext';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function todayLocalDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

function parseDateOnly(value) {
  if (!value || typeof value !== 'string') return null;

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, monthIndex, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(value) {
  const date = parseDateOnly(value);
  if (!date) return '—';

  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(date);
  } catch {
    return String(value);
  }
}

function asPositiveNumber(value) {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (numeric <= 0) return null;
  return numeric;
}

export default function ExpenseFuel() {
  const { vehicles, fuelLogs, dispatch } = useFleet();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const expenseRows = useMemo(
    () => (Array.isArray(fuelLogs) ? fuelLogs.map((entry) => ({ ...entry, type: 'Fuel' })) : []),
    [fuelLogs],
  );

  const [formValues, setFormValues] = useState(() => ({
    vehicleId: '',
    liters: '',
    totalCost: '',
    date: todayLocalDateString(),
  }));

  const [formError, setFormError] = useState('');

  function getOperationalCostForVehicle(vehicleId) {
    if (!vehicleId) return 0;

    return fuelLogs.reduce((sum, entry) => {
      if (!entry || String(entry.vehicleId) !== String(vehicleId)) return sum;

      const amount = typeof entry.amount === 'number' ? entry.amount : Number(entry.amount);
      if (!Number.isFinite(amount)) return sum;

      return sum + amount;
    }, 0);
  }

  const selectedVehicleLabel = useMemo(() => {
    if (!selectedVehicleId) return '';

    const match = vehicles.find((v) => String(v?.id) === String(selectedVehicleId));
    const name = match?.name ? String(match.name) : '';
    return name ? `${name} (${selectedVehicleId})` : String(selectedVehicleId);
  }, [selectedVehicleId, vehicles]);

  const operationalCost = selectedVehicleId ? getOperationalCostForVehicle(selectedVehicleId) : 0;

  const columns = useMemo(
    () => [
      {
        key: 'date',
        header: 'Date',
        accessor: 'date',
        cell: ({ value }) => <span className="whitespace-nowrap font-medium text-primary">{formatDate(value)}</span>,
      },
      {
        key: 'vehicleId',
        header: 'Vehicle ID',
        accessor: 'vehicleId',
        className: 'whitespace-nowrap font-medium text-muted',
      },
      {
        key: 'type',
        header: 'Expense Type',
        accessor: 'type',
        cell: ({ value }) => (
          <span className="badge bg-surface border-default text-primary shadow-sm-token px-3 py-1">
            {value || '—'}
          </span>
        ),
      },
      {
        key: 'amount',
        header: 'Amount',
        accessor: 'amount',
        className: 'whitespace-nowrap tabular-nums',
        cell: ({ value }) => {
          const numeric = typeof value === 'number' ? value : Number(value);
          if (!Number.isFinite(numeric)) return '—';
          return <span className="font-semibold text-accent">₹{numeric.toFixed(2)}</span>;
        },
      },
    ],
    []
  );

  const openModal = () => {
    setFormError('');
    setIsModalOpen(true);

    setFormValues((prev) => ({
      vehicleId: prev.vehicleId || selectedVehicleId || '',
      liters: '',
      totalCost: '',
      date: prev.date || todayLocalDateString(),
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onChangeField = (field) => (event) => {
    const nextValue = event?.target?.value ?? '';

    setFormValues((prev) => ({
      ...prev,
      [field]: nextValue,
    }));

    if (field === 'vehicleId') {
      setSelectedVehicleId(String(nextValue || ''));
    }
  };

  const onSubmitFuel = (event) => {
    event.preventDefault();
    setFormError('');

    const vehicleId = String(formValues.vehicleId || '').trim();
    const liters = asPositiveNumber(formValues.liters);
    const totalCost = asPositiveNumber(formValues.totalCost);
    const date = String(formValues.date || '').trim();

    if (!vehicleId || !liters || !totalCost || !date) {
      setFormError('All fields are required. Please enter valid positive numbers for liters and total cost.');
      return;
    }

    dispatch({
      type: 'LOG_FUEL',
      payload: {
        vehicleId,
        liters,
        amount: totalCost,
        date,
      },
    });
    setSelectedVehicleId(vehicleId);
    setIsModalOpen(false);

    setFormValues({
      vehicleId,
      liters: '',
      totalCost: '',
      date: todayLocalDateString(),
    });
  };

  // Shared classes for premium inputs
  const inputClassName = "mt-2 w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary transition-all duration-200 outline-none focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] shadow-sm-token";
  const labelClassName = "block text-xs font-bold uppercase tracking-widest text-muted mb-1";

  return (
    <div className="px-6 py-10 md:py-14 bg-main min-h-full">
      <div className="mx-auto max-w-7xl space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight premium-header">
              Expense & Fuel
            </h1>
            <p className="mt-5 text-base text-muted max-w-2xl leading-relaxed">
              Log fuel expenses per vehicle and track your total operational cost metrics in a streamlined dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="btn-primary shadow-md-token px-6 py-3 font-medium text-sm" onClick={openModal}>
              + Log Fuel Entry
            </button>
          </div>
        </div>

        {/* Operational Cost Summary Card */}
        <div className="card p-6 md:p-8 border-l-4 border-l-[var(--brand-accent)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm font-bold uppercase tracking-widest text-muted">Operational Cost Summary</div>
            <div className="text-lg md:text-xl font-medium text-primary">
              {selectedVehicleId ? (
                <span>
                  Total for <span className="font-bold">{selectedVehicleLabel}</span>:{' '}
                  <span className="tabular-nums font-bold text-accent text-2xl ml-2">₹{operationalCost.toFixed(2)}</span>
                </span>
              ) : (
                <span className="text-muted italic">Select a vehicle to view costs</span>
              )}
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="space-y-4">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="text-xl font-bold text-primary">Expense History</h2>
            <div className="text-sm text-muted">Updates in real-time</div>
          </div>

          <DataTable columns={columns} data={expenseRows} rowKey="id" emptyMessage="No expenses logged yet" />
        </div>

        {/* Form Modal */}
        <ModalForm open={isModalOpen} title="Record Fuel Expense" onClose={closeModal} onSubmit={onSubmitFuel} submitLabel="Add Entry">
          {formError ? (
            <div className="p-4 mb-2 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] rounded-xl text-sm text-[var(--danger)] font-medium">
              {formError}
            </div>
          ) : null}

          <div>
            <label className={labelClassName} htmlFor="vehicleId">
              Select Vehicle
            </label>
            <select
              id="vehicleId"
              className={inputClassName}
              value={formValues.vehicleId}
              onChange={onChangeField('vehicleId')}
              required
            >
              <option value="" disabled>Select a vehicle...</option>
              {vehicles.map((vehicle) => {
                const id = vehicle?.id ?? vehicle?.vehicleId ?? '';
                if (!id) return null;

                const name = vehicle?.name ?? vehicle?.label ?? vehicle?.model ?? '';
                const label = name ? `${name} (${id})` : String(id);

                return (
                  <option key={String(id)} value={String(id)}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="liters">
                Fuel Volume (Liters)
              </label>
              <input
                id="liters"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={inputClassName}
                value={formValues.liters}
                onChange={onChangeField('liters')}
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="totalCost">
                Total Cost (₹)
              </label>
              <input
                id="totalCost"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={inputClassName}
                value={formValues.totalCost}
                onChange={onChangeField('totalCost')}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClassName} htmlFor="date">
              Transaction Date
            </label>
            <input
              id="date"
              type="date"
              className={inputClassName}
              value={formValues.date}
              onChange={onChangeField('date')}
              required
            />
          </div>
        </ModalForm>
      </div>
    </div>
  );
}