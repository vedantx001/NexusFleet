import React, { useMemo, useState } from 'react';
import DataTable from '../../../components/table/DataTable';
import StatusPill from '../../../components/common/StatusPill';
import driversData from '../../../mock/drivers';

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

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
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

function isLicenseExpired(expiryDateStr) {
  const expiry = parseDateOnly(expiryDateStr);
  if (!expiry) return false;

  return expiry < startOfToday();
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

// Helper for premium avatar initials
function getInitials(name) {
  if (!name) return '';
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function DriverProfiles() {
  const drivers = Array.isArray(driversData) ? driversData : [];

  const [dutyStatusById, setDutyStatusById] = useState(() => {
    const initial = {};
    for (const driver of drivers) {
      const value = DUTY_STATUSES.includes(driver?.dutyStatus) ? driver.dutyStatus : 'Off Duty';
      initial[driver.id] = value;
    }
    return initial;
  });

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Driver Name',
        accessor: 'name',
        cell: ({ value }) => (
          <div className="flex items-center gap-4">
            <div className="avatar-premium shadow-sm-token">
              {getInitials(value)}
            </div>
            <span className="font-semibold tracking-wide">{value}</span>
          </div>
        )
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
              {expired ? <span className="badge badge-danger shadow-sm-token">Expired</span> : null}
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
          return (
            <span className="score-pill tabular-nums">
              {clamped}
            </span>
          );
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
            setDutyStatusById((prev) => ({
              ...prev,
              [row.id]: nextDutyStatus(prev[row.id] || 'Off Duty'),
            }));
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
    ],
    [dutyStatusById]
  );

  return (
    <div className="px-6 py-10 md:py-14 bg-main min-h-full">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Premium Header Area */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight premium-header">
            Driver Profiles
          </h1>
          <p className="mt-5 text-base text-muted max-w-2xl leading-relaxed">
            Monitor and manage your workforce with precision. Review duty statuses, license compliance, and safety performance records in real-time.
          </p>
        </div>

        {/* Data Table Container */}
        <DataTable columns={columns} data={drivers} rowKey="id" />
        
      </div>
    </div>
  );
}1