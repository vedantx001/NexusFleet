const Maintenance = require('../../models/Maintanance');
const Vehicle = require('../../models/Vehicle');
const { sendSuccess } = require('../../utils/response');

function pickAllowedMaintenanceFields(payload) {
  const allowed = ['vehicle', 'description', 'cost', 'serviceDate', 'status'];
  const data = {};

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined) {
      data[key] = payload[key];
    }
  }
  return data;
}

async function createMaintenance(req, res, next) {
  try {
    const body = req.body || {};
    const maintenanceData = pickAllowedMaintenanceFields(body);

    const requiredFields = ['vehicle', 'cost'];
    const missing = requiredFields.filter((field) => maintenanceData[field] === undefined || maintenanceData[field] === null || maintenanceData[field] === '');
    if (missing.length) {
      const err = new Error(`Missing required fields: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await Vehicle.findById(maintenanceData.vehicle);
    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    const maintenance = await Maintenance.create(maintenanceData);

    // Vehicle schema enum uses IN_SHOP
    vehicle.status = 'IN_SHOP';
    await vehicle.save();

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Maintenance logged; vehicle moved to shop',
      data: { maintenance, vehicle },
    });
  } catch (e) {
    next(e);
  }
}

async function listMaintenance(req, res, next) {
  try {
    const maintenanceLogs = await Maintenance.find({})
      .sort({ serviceDate: -1, createdAt: -1 })
      .populate('vehicle', 'name licensePlate vehicleType status')
      .lean();

    return sendSuccess(res, {
      message: 'Maintenance logs fetched',
      data: { maintenanceLogs },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createMaintenance,
  listMaintenance,
};
