import React, { useState } from 'react';
import { VEHICLE_TYPES } from '../constants/vehicleConstants';
import InputField from './forms/InputField';
import SelectDropdown from './forms/SelectDropdown';

export default function VehicleForm({ vehicle, onSave, onCancel, existingPlates }) {
  const isEdit = Boolean(vehicle);
  const [formData, setFormData] = useState(vehicle || { name: '', plate: '', type: '', capacity: '', odometer: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Name is required';
    if (!formData.plate.trim()) nextErrors.plate = 'Plate is required';
    if (!isEdit && existingPlates.includes(formData.plate.toUpperCase())) {
      nextErrors.plate = 'License plate already exists';
    }
    if (!formData.type) nextErrors.type = 'Type is required';
    if (!formData.capacity || Number(formData.capacity) <= 0) nextErrors.capacity = 'Capacity must be > 0';
    if (formData.odometer === '' || Number(formData.odometer) < 0) nextErrors.odometer = 'Invalid odometer reading';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-5">
      <InputField
        label="Vehicle Name / Model"
        id="name"
        value={formData.name}
        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
        error={errors.name}
        required
      />
      <InputField
        label="License Plate"
        id="plate"
        value={formData.plate}
        onChange={(event) => setFormData({ ...formData, plate: event.target.value })}
        error={errors.plate}
        disabled={isEdit}
        required
        placeholder="e.g. TRK-1234"
      />
      <SelectDropdown
        label="Vehicle Type"
        id="type"
        value={formData.type}
        onChange={(event) => setFormData({ ...formData, type: event.target.value })}
        options={VEHICLE_TYPES}
        error={errors.type}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Max Capacity (kg)"
          id="capacity"
          type="number"
          value={formData.capacity}
          onChange={(event) => setFormData({ ...formData, capacity: event.target.value })}
          error={errors.capacity}
          required
        />
        <InputField
          label="Odometer (km)"
          id="odometer"
          type="number"
          value={formData.odometer}
          onChange={(event) => setFormData({ ...formData, odometer: event.target.value })}
          error={errors.odometer}
          required
        />
      </div>

      <div className="mt-auto pt-6 border-t border-[var(--border)] flex justify-end gap-3 pb-6">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          {isEdit ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
}
