const FuelLog = require('../../models/FuelLog');
const { sendSuccess } = require('../../utils/response');

async function createExpense(req, res, next) {
  try {
    const { vehicle, trip, liters, cost, date } = req.body || {};

    if (!vehicle) {
      const err = new Error('vehicle is required');
      err.statusCode = 400;
      throw err;
    }
    if (liters === undefined || liters === null) {
      const err = new Error('liters is required');
      err.statusCode = 400;
      throw err;
    }
    if (cost === undefined || cost === null) {
      const err = new Error('cost is required');
      err.statusCode = 400;
      throw err;
    }

    const fuelLog = await FuelLog.create({
      vehicle,
      ...(trip ? { trip } : {}),
      liters,
      cost,
      ...(date ? { date } : {}),
    });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Expense created',
      data: fuelLog,
    });
  } catch (err) {
    return next(err);
  }
}

async function getExpenses(req, res, next) {
  try {
    const fuelLogs = await FuelLog.find({})
      .sort({ date: -1 })
      .populate('vehicle', 'name licensePlate vehicleType status')
      .populate('trip', 'origin destination distanceKm status')
      .lean();

    return sendSuccess(res, {
      message: 'Expenses fetched',
      data: fuelLogs,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createExpense,
  getExpenses,
};
