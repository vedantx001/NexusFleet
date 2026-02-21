const Driver = require('../../models/Driver');
const { sendSuccess } = require('../../utils/response');

function pickAllowedDriverFields(payload) {
  const allowed = [
    'name',
    'licenseNumber',
    'licenseExpiry',
    'licenseCategory',
    'safetyScore',
    'status',
    'totalTrips',
    'completedTrips',
  ];

  const update = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && payload[key] !== undefined) {
      update[key] = payload[key];
    }
  }
  return update;
}

async function createDriver(req, res, next) {
  try {
    const body = req.body || {};
    const driverData = pickAllowedDriverFields(body);

    const requiredFields = ['name', 'licenseNumber', 'licenseExpiry', 'licenseCategory'];
    const missing = requiredFields.filter((field) => driverData[field] === undefined || driverData[field] === null || driverData[field] === '');
    if (missing.length) {
      const err = new Error(`Missing required fields: ${missing.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const driver = await Driver.create(driverData);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Driver created',
      data: { driver },
    });
  } catch (e) {
    next(e);
  }
}

async function listDrivers(req, res, next) {
  try {
    const drivers = await Driver.find({}).sort({ createdAt: -1 });

    return sendSuccess(res, {
      message: 'Drivers fetched',
      data: { drivers },
    });
  } catch (e) {
    next(e);
  }
}

async function updateDriver(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error('Driver id is required');
      err.statusCode = 400;
      throw err;
    }

    const update = pickAllowedDriverFields(req.body || {});
    if (!Object.keys(update).length) {
      const err = new Error('No valid Driver fields provided');
      err.statusCode = 400;
      throw err;
    }

    const driver = await Driver.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      const err = new Error('Driver not found');
      err.statusCode = 404;
      throw err;
    }

    return sendSuccess(res, {
      message: 'Driver updated',
      data: { driver },
    });
  } catch (e) {
    next(e);
  }
}

async function deleteDriver(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error('Driver id is required');
      err.statusCode = 400;
      throw err;
    }

    const driver = await Driver.findByIdAndDelete(id);
    if (!driver) {
      const err = new Error('Driver not found');
      err.statusCode = 404;
      throw err;
    }

    return sendSuccess(res, {
      message: 'Driver deleted',
      data: { driver },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createDriver,
  listDrivers,
  updateDriver,
  deleteDriver,
};
