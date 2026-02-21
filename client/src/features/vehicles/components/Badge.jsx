import React from 'react';
import { VEHICLE_STATUSES } from '../constants/vehicleConstants';

export default function Badge({ statusId }) {
  const status = Object.values(VEHICLE_STATUSES).find((item) => item.id === statusId) || VEHICLE_STATUSES.OUT_OF_SERVICE;

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
      {statusId}
    </span>
  );
}
