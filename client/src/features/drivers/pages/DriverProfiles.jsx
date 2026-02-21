import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import DataTable from '../../../components/table/DataTable';
import StatusPill from '../../../components/common/StatusPill';
import Loader from '../../../components/common/Loader';
import ErrorMessage from '../../../components/common/ErrorMessage';
import ModalForm from '../../../components/forms/ModalForm';
import { VEHICLE_TYPES } from '../../vehicles/constants/vehicleConstants';
import { useFleet, isLicenseExpired } from '../../../context/FleetContext';

const DUTY_STATUSES = ['On Duty', 'Off Duty', 'Suspended'];

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

function nextDutyStatus(current) {
  const idx = DUTY_STATUSES.indexOf(current);
  if (idx === -1) return DUTY_STATUSES[0];
  return DUTY_STATUSES[(idx + 1) % DUTY_STATUSES.length];
}

function placeholderSafetyScore(driver) {
  const seed = `${driver?.licenseNumber || ''}|${driver?.name || ''}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }

  return Math.abs(hash) % 101;
}

function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DriverProfiles() {
  const { drivers, dispatch, isLoading, error } = useFleet();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [formValues, setFormValues] = useState(() => ({
    name: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    licenseCategories: ['Van'],
    dutyStatus: 'Off Duty',
  }));

  const [dutyStatusById, setDutyStatusById] = useState(() => {
    const initial = {};
    for (const driver of drivers) {
      const value = DUTY_STATUSES.includes(driver?.dutyStatus) ? driver.dutyStatus : 'Off Duty';
      initial[driver.id] = value;
    }
    return initial;
  });

  useEffect(() => {
    if (!Array.isArray(drivers) || !drivers.length) return;
    setDutyStatusById((prev) => {
      const next = { ...prev };
      for (const driver of drivers) {
        if (!driver?.id) continue;
        if (next[driver.id] !== undefined) continue;
        const value = DUTY_STATUSES.includes(driver?.dutyStatus) ? driver.dutyStatus : 'Off Duty';
        next[driver.id] = value;
      }
      return next;
    });
  }, [drivers]);

  const inputClassName =
    'mt-2 w-full rounded-xl border border-default bg-surface px-4 py-3 text-sm text-primary transition-all duration-200 outline-none focus:border-[var(--brand-accent)] focus:ring-1 focus:ring-[var(--brand-accent)] shadow-sm-token';
  const labelClassName = 'block text-xs font-bold uppercase tracking-widest text-muted mb-1';

  const onOpenAdd = () => {
    setFormError('');
    setFormValues({
      name: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      licenseCategories: ['Van'],
      dutyStatus: 'Off Duty',
    });
    setIsAddOpen(true);
  };

  const onChangeField = (field) => (event) => {
    const nextValue = event?.target?.value ?? '';
    setFormValues((prev) => ({ ...prev, [field]: nextValue }));
  };

  const onToggleCategory = (category) => {
    setFormValues((prev) => {
      const current = Array.isArray(prev.licenseCategories) ? prev.licenseCategories : [];
      const next = current.includes(category) ? current.filter((c) => c !== category) : [...current, category];
      return { ...prev, licenseCategories: next.length ? next : ['Van'] };
    });
  };

  const onSubmitAdd = (event) => {
    event.preventDefault();
    setFormError('');

    const name = String(formValues.name || '').trim();
    const licenseNumber = String(formValues.licenseNumber || '').trim();
    const licenseExpiryDate = String(formValues.licenseExpiryDate || '').trim();
    const licenseCategories = Array.isArray(formValues.licenseCategories) ? formValues.licenseCategories : [];

    if (!name || !licenseNumber || !licenseExpiryDate || !licenseCategories.length) {
      setFormError('All fields are required (including at least one license category).');
      return;
    }

    dispatch({
      type: 'ADD_DRIVER',
      payload: {
        name,
        licenseNumber,
        licenseExpiryDate,
        licenseCategories,
        dutyStatus: formValues.dutyStatus,
        status: 'Available',
      },
    });

    setIsAddOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Driver Name',
        accessor: 'name',
        cell: ({ value }) => (
          <div className="flex items-center gap-4">
            <div className="avatar-premium shadow-sm-token">{getInitials(value)}</div>
            <span className="font-semibold tracking-wide">{value}</span>
          </div>
        ),
      },
      {
        key: 'licenseNumber',
        header: 'License Number',
        accessor: 'licenseNumber',
        className: 'whitespace-nowrap font-medium text-muted',
      },
      {
        key: 'licenseExpiryDate',
        header: 'License Expiry',
        accessor: 'licenseExpiryDate',
        cell: ({ value }) => {
          const expired = isLicenseExpired(value);

          return (
            <div className="flex items-center gap-3">
              <span className="whitespace-nowrap font-medium">{formatDate(value)}</span>
              {expired ? <span className="badge badge-danger shadow-sm-token">Expired</span> : <span className="badge shadow-sm-token">Valid</span>}
            </div>
          );
        },
      },
      {
        key: 'licenseCategories',
        header: 'Categories',
        accessor: 'licenseCategories',
        cell: ({ value }) => {
          const list = Array.isArray(value) ? value : [];
          if (!list.length) return <span className="text-muted">—</span>;

          return (
            <div className="flex flex-wrap gap-2">
              {list.map((c) => (
                <span key={String(c)} className="badge bg-surface border-default text-primary shadow-sm-token px-3 py-1">
                  {c}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        key: 'safetyScore',
        header: 'Safety Score',
        accessor: 'safetyScore',
        className: 'whitespace-nowrap',
        cell: ({ row, value }) => {
          const numeric = typeof value === 'number' ? value : placeholderSafetyScore(row);
          const clamped = Math.max(0, Math.min(100, numeric));
          return <span className="score-pill tabular-nums">{clamped}</span>;
        },
      },
      {
        key: 'dutyStatus',
        header: 'Duty Status',
        cell: ({ row }) => {
          const expired = isLicenseExpired(row?.licenseExpiryDate);
          const status = dutyStatusById[row?.id] || 'Off Duty';
          const tooltip = expired ? 'Blocked: License Expired' : 'Click to change status';

          const onToggle = () => {
            if (expired) return;
            const next = nextDutyStatus(dutyStatusById[row?.id] || 'Off Duty');

            setDutyStatusById((prev) => ({
              ...prev,
              [row.id]: next,
            }));

            dispatch({
              type: 'UPDATE_DRIVER',
              payload: {
                id: row.id,
                patch: { dutyStatus: next },
              },
            });
          };

          return (
            <button
              type="button"
              className="inline-flex items-center transition-transform hover:scale-105 active:scale-95"
              onClick={onToggle}
              title={tooltip}
              aria-label={`Duty status: ${status}${expired ? '. Blocked: License Expired' : ''}`}
            >
              <StatusPill status={status} />
            </button>
          );
        },
      },
      {
        key: 'status',
        header: 'Assignment',
        accessor: 'status',
        cell: ({ value }) => <span className="whitespace-nowrap font-semibold text-primary">{value || '—'}</span>,
      },
    ],
    [dispatch, dutyStatusById],
  );

  return (
    <div className="px-6 py-10 md:py-14 bg-main min-h-full">
      <div className="mx-auto max-w-7xl space-y-8">
        {isLoading && drivers.length === 0 ? <Loader label="Loading drivers…" /> : null}
        {error ? <ErrorMessage message={error} /> : null}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight premium-header">Driver Profiles</h1>
            <p className="mt-5 text-base text-muted max-w-2xl leading-relaxed">
              Monitor and manage your workforce with precision. Review duty statuses, license compliance, and safety performance records in real-time.
            </p>
          </div>

          <button type="button" className="btn-primary shadow-md-token px-6 py-3 font-medium text-sm" onClick={onOpenAdd}>
            <Plus size={18} /> Add Driver
          </button>
        </div>

        <DataTable columns={columns} data={drivers} rowKey="id" />

        <ModalForm open={isAddOpen} title="Add Driver" onClose={() => setIsAddOpen(false)} onSubmit={onSubmitAdd} submitLabel="Add Driver">
          {formError ? (
            <div className="p-4 mb-2 bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] rounded-xl text-sm text-[var(--danger)] font-medium">
              {formError}
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClassName} htmlFor="driverName">
                Driver Name
              </label>
              <input
                id="driverName"
                className={inputClassName}
                value={formValues.name}
                onChange={onChangeField('name')}
                placeholder="Alex"
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="licenseNumber">
                License Number
              </label>
              <input
                id="licenseNumber"
                className={inputClassName}
                value={formValues.licenseNumber}
                onChange={onChangeField('licenseNumber')}
                placeholder="DL-0000-AX"
                required
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="licenseExpiryDate">
                License Expiry
              </label>
              <input
                id="licenseExpiryDate"
                type="date"
                className={inputClassName}
                value={formValues.licenseExpiryDate}
                onChange={onChangeField('licenseExpiryDate')}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <div className="text-xs font-bold uppercase tracking-widest text-muted mb-3">License Categories</div>
              <div className="flex flex-wrap gap-3">
                {VEHICLE_TYPES.map((category) => {
                  const active = Array.isArray(formValues.licenseCategories) && formValues.licenseCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      className={
                        active
                          ? 'badge px-4 py-2 border border-[var(--brand-accent)] bg-[color-mix(in_srgb,var(--brand-accent)_10%,transparent)] text-primary shadow-sm-token'
                          : 'badge px-4 py-2 border border-default bg-surface text-muted hover:text-primary shadow-sm-token'
                      }
                      onClick={() => onToggleCategory(category)}
                      aria-pressed={active}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClassName} htmlFor="dutyStatus">
                Duty Status
              </label>
              <select id="dutyStatus" className={inputClassName} value={formValues.dutyStatus} onChange={onChangeField('dutyStatus')}>
                {DUTY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ModalForm>
      </div>
    </div>
  );
}