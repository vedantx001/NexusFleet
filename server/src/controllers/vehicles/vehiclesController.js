const Vehicle = require('../../models/Vehicle');
const { sendSuccess } = require('../../utils/response');

function pickAllowedVehicleFields(payload) {
  const allowed = [
    'name',
    'model',
    'licensePlate',
    'vehicleType',
    'maxCapacityKg',
    'odometer',
    'acquisitionCost',
    'status',
    'region',
  ];

  const update = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined) {
      update[key] = payload[key];
    }
  }
  return update;
}

async function createVehicle(req, res, next) {
  try {
    const body = req.body || {};
    const vehicleData = pickAllowedVehicleFields(body);

    const requiredFields = ['name', 'licensePlate', 'vehicleType', 'maxCapacityKg', 'acquisitionCost'];
    const missing = requiredFields.filter((field) => vehicleData[field] === undefined || vehicleData[field] === null || vehicleData[field] === '');
    if (missing.length) {
      const err = new Error(`Missing required fields: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await Vehicle.create(vehicleData);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Vehicle created',
      data: { vehicle },
    });
  } catch (e) {
    next(e);
  }
}

async function listVehicles(req, res, next) {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });

    return sendSuccess(res, {
      message: 'Vehicles fetched',
      data: { vehicles },
    });
  } catch (e) {
    next(e);
  }
}

async function updateVehicle(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error('Vehicle id is required');
      err.statusCode = 400;
      throw err;
    }

    const update = pickAllowedVehicleFields(req.body || {});
    if (!Object.keys(update).length) {
      const err = new Error('No valid Vehicle fields provided');
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return sendSuccess(res, {
      message: 'Vehicle updated',
      data: { vehicle },
    });
  } catch (e) {
    next(e);
  }
}

async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error('Vehicle id is required');
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return sendSuccess(res, {
      message: 'Vehicle deleted',
      data: { vehicle },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createVehicle,
  listVehicles,
  updateVehicle,
  deleteVehicle,
};
