import React from 'react';

const STATUS_CLASS_BY_VALUE = {
  'On Duty': 'status-success',
  'Off Duty': 'status-neutral',
  Suspended: 'status-danger',
};

export default function StatusPill({ status }) {
  const label = status || 'Unknown';
  const variantClass = STATUS_CLASS_BY_VALUE[label] || 'status-neutral';

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-semibold ${variantClass}`}>
      {label}
    </span>
  );
}
