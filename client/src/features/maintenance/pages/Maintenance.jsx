import React, { useMemo, useState } from 'react';

import DataTable from '../../../components/table/DataTable';
import ModalForm from '../../../components/forms/ModalForm';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useFleet } from '../../../context/FleetContext';
import { VEHICLE_STATUSES } from '../../vehicles/constants/vehicleConstants';

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

export default function Maintenance() {
  const { vehicles, maintenanceLogs, dispatch, isLoading, error } = useFleet();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formValues, setFormValues] = useState(() => ({
    vehicleId: vehicles[0]?.id || '',
    maintenanceType: 'Oil Change',
    date: todayLocalDateString(),
    cost: '',
    notes: '',
  }));

  const inShopVehicles = useMemo(
    () => vehicles.filter((v) => v.status === VEHICLE_STATUSES.IN_SHOP.id),
    [vehicles],
  );

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
        header: 'Vehicle',
        accessor: 'vehicleId',
        cell: ({ value }) => {
          const v = vehicles.find((x) => String(x.id) === String(value));
          const label = v ? `${v.name} (${v.plate})` : String(value);
          return <span className="whitespace-nowrap font-semibold text-primary">{label}</span>;
        },
      },
      {
        key: 'type',
        header: 'Maintenance',
        accessor: 'type',
        cell: ({ value }) => (
          <span className="badge bg-surface border-default text-primary shadow-sm-token px-3 py-1">{value || '—'}</span>
        ),
      },
      {
        key: 'cost',
        header: 'Cost',
        accessor: 'cost',
        className: 'whitespace-nowrap tabular-nums',
        cell: ({ value }) => {
          const numeric = typeof value === 'number' ? value : Number(value);
          if (!Number.isFinite(numeric)) return <span className="text-muted">—</span>;
          return <span className="font-semibold text-accent">₹{numeric.toFixed(2)}</span>;
        },
      },
      {
        key: 'notes',
        header: 'Notes',
        accessor: 'notes',
        cell: ({ value }) => <span className="text-muted">{value || '—'}</span>,
      },
    ],
    [vehicles],
  );

  const inputClassName =
    'mt-2 w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary transition-all duration-200 outline-none focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] shadow-sm-token';
  const labelClassName = 'block text-xs font-bold uppercase tracking-widest text-muted mb-1';

  const openModal = () => {
    setFormError('');
    setIsModalOpen(true);
    setFormValues((prev) => ({
      vehicleId: prev.vehicleId || vehicles[0]?.id || '',
      maintenanceType: prev.maintenanceType || 'Oil Change',
      date: prev.date || todayLocalDateString(),
      cost: '',
      notes: '',
    }));
  };

  const closeModal = () => setIsModalOpen(false);

  const onChangeField = (field) => (event) => {
    const nextValue = event?.target?.value ?? '';
    setFormValues((prev) => ({ ...prev, [field]: nextValue }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setFormError('');

    const vehicleId = String(formValues.vehicleId || '').trim();
    const maintenanceType = String(formValues.maintenanceType || '').trim();
    const date = String(formValues.date || '').trim();

    if (!vehicleId || !maintenanceType || !date) {
      setFormError('Vehicle, maintenance type, and date are required.');
      return;
    }

    const cost = formValues.cost === '' ? null : Number(formValues.cost);
    if (formValues.cost !== '' && !Number.isFinite(cost)) {
      setFormError('Cost must be a valid number.');
      return;
    }

    dispatch({
      type: 'LOG_MAINTENANCE',
      payload: {
        vehicleId,
        maintenanceType,
        date,
        cost,
        notes: formValues.notes,
      },
    });

    setIsModalOpen(false);
  };

  return (
    <div className="px-6 py-10 md:py-14 bg-main min-h-full">
      <div className="mx-auto max-w-7xl space-y-10">
        {isLoading && vehicles.length === 0 ? <Loader label="Loading maintenance…" /> : null}
        {error ? <ErrorMessage message={error} /> : null}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight premium-header">Maintenance</h1>
            <p className="mt-5 text-base text-muted max-w-2xl leading-relaxed">
              Log maintenance (e.g. Oil Change). Vehicles are automatically moved to <span className="font-semibold text-primary">In Shop</span> and hidden from dispatch.
            </p>
          </div>

          <button type="button" className="btn-primary shadow-md-token px-6 py-3 font-medium text-sm" onClick={openModal}>
            + Log Oil Change
          </button>
        </div>

        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">Vehicles In Shop</h2>
            <div className="text-sm text-muted">{inShopVehicles.length} vehicle(s)</div>
          </div>

          <div className="mt-6 space-y-3">
            {inShopVehicles.length ? (
              inShopVehicles.map((v) => (
                <div key={String(v.id)} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-default bg-surface">
                  <div>
                    <div className="font-semibold text-primary">{v.name} ({v.plate})</div>
                    <div className="text-sm text-muted">Last maintained: {v.lastMaintained || '—'}</div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary px-6 py-2.5 font-medium text-sm"
                    onClick={() => dispatch({ type: 'COMPLETE_MAINTENANCE', payload: { vehicleId: v.id } })}
                  >
                    Mark Available
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted">No vehicles are currently in shop.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="text-xl font-bold text-primary">Maintenance History</h2>
            <div className="text-sm text-muted">Updates in real-time</div>
          </div>
          <DataTable columns={columns} data={maintenanceLogs} rowKey="id" emptyMessage="No maintenance logged yet" />
        </div>

        <ModalForm open={isModalOpen} title="Log Maintenance" onClose={closeModal} onSubmit={onSubmit} submitLabel="Log">
          {formError ? (
            <div className="p-4 mb-2 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] rounded-xl text-sm text-[var(--danger)] font-medium">
              {formError}
            </div>
          ) : null}

          <div>
            <label className={labelClassName} htmlFor="vehicleId">
              Vehicle
            </label>
            <select id="vehicleId" className={inputClassName} value={formValues.vehicleId} onChange={onChangeField('vehicleId')} required>
              <option value="" disabled>
                Select a vehicle...
              </option>
              {vehicles.map((v) => (
                <option key={String(v.id)} value={String(v.id)}>
                  {v.name} ({v.plate})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClassName} htmlFor="maintenanceType">
                Maintenance Type
              </label>
              <input
                id="maintenanceType"
                className={inputClassName}
                value={formValues.maintenanceType}
                onChange={onChangeField('maintenanceType')}
                placeholder="Oil Change"
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="date">
                Date
              </label>
              <input id="date" type="date" className={inputClassName} value={formValues.date} onChange={onChangeField('date')} required />
            </div>

            <div>
              <label className={labelClassName} htmlFor="cost">
                Cost (₹)
              </label>
              <input
                id="cost"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                className={inputClassName}
                value={formValues.cost}
                onChange={onChangeField('cost')}
                placeholder="0.00"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClassName} htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                className={inputClassName}
                rows={3}
                value={formValues.notes}
                onChange={onChangeField('notes')}
                placeholder="Optional notes..."
              />
            </div>
          </div>
        </ModalForm>
      </div>
    </div>
  );
}
