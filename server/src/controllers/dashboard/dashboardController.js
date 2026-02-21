const { sendSuccess } = require('../../utils/response');
const Vehicle = require('../../models/Vehicle');
const Trip = require('../../models/Trip');

async function getDashboard(req, res, next) {
  try {
    const [vehicleAgg, tripAgg] = await Promise.all([
      Vehicle.aggregate([
        {
          $group: {
            _id: null,
            activeFleet: {
              $sum: {
                $cond: [{ $ne: ['$status', 'RETIRED'] }, 1, 0],
              },
            },
            vehiclesInShop: {
              $sum: {
                $cond: [{ $eq: ['$status', 'IN_SHOP'] }, 1, 0],
              },
            },
            idleVehicles: {
              $sum: {
                $cond: [{ $eq: ['$status', 'AVAILABLE'] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            activeFleet: 1,
            vehiclesInShop: 1,
            idleVehicles: 1,
          },
        },
      ]),
      Trip.aggregate([
        { $match: { status: 'DISPATCHED' } },
        { $group: { _id: null, pendingTrips: { $sum: 1 } } },
        { $project: { _id: 0, pendingTrips: 1 } },
      ]),
    ]);

    const activeFleet = vehicleAgg?.[0]?.activeFleet || 0;
    const vehiclesInShop = vehicleAgg?.[0]?.vehiclesInShop || 0;
    const idleVehicles = vehicleAgg?.[0]?.idleVehicles || 0;
    const pendingTrips = tripAgg?.[0]?.pendingTrips || 0;

    return sendSuccess(res, {
      message: 'Dashboard metrics fetched',
      data: {
        activeFleet,
        vehiclesInShop,
        idleVehicles,
        pendingTrips,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getDashboard,
};
