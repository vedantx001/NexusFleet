const { sendSuccess } = require('../../utils/response');
const FuelLog = require('../../models/FuelLog');
const Trip = require('../../models/Trip');

function roundTo(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

async function getAnalytics(req, res, next) {
  try {
    const [tripAgg, fuelAgg] = await Promise.all([
      Trip.aggregate([
        { $match: { status: 'COMPLETED' } },
        {
          $group: {
            _id: null,
            totalDistanceKm: { $sum: { $ifNull: ['$distanceKm', 0] } },
            totalRevenue: { $sum: { $ifNull: ['$revenue', 0] } },
          },
        },
      ]),
      FuelLog.aggregate([
        {
          $group: {
            _id: null,
            totalLiters: { $sum: { $ifNull: ['$liters', 0] } },
            totalFuelCost: { $sum: { $ifNull: ['$cost', 0] } },
          },
        },
      ]),
    ]);

    const totalDistanceKm = tripAgg?.[0]?.totalDistanceKm || 0;
    const totalRevenue = tripAgg?.[0]?.totalRevenue || 0;
    const totalLiters = fuelAgg?.[0]?.totalLiters || 0;
    const totalFuelCost = fuelAgg?.[0]?.totalFuelCost || 0;

    const operationalCost = totalFuelCost;
    const fuelEfficiency = totalLiters > 0 ? totalDistanceKm / totalLiters : 0;
    const roi = operationalCost > 0 ? (totalRevenue - operationalCost) / operationalCost : 0;

    return sendSuccess(res, {
      message: 'Analytics fetched',
      data: {
        fuelEfficiency: roundTo(fuelEfficiency, 2),
        operationalCost: roundTo(operationalCost, 2),
        roi: roundTo(roi, 4),
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getAnalytics,
};
