const Trip = require('../../models/Trip');
const Vehicle = require('../../models/Vehicle');
const Driver = require('../../models/Driver');

const { sendSuccess } = require('../../utils/response');

function normalizeTripPayload(body) {
  const b = body || {};

  const vehicle = b.vehicle || b.vehicleId;
  const driver = b.driver || b.driverId;

  const cargoWeightKg =
    b.cargoWeightKg !== undefined
      ? b.cargoWeightKg
      : b.cargoWeight !== undefined
        ? b.cargoWeight
        : undefined;

  return {
    vehicle,
    driver,
    cargoWeightKg,
    origin: b.origin,
    destination: b.destination,
    distanceKm: b.distanceKm,
    revenue: b.revenue,
    startOdometer: b.startOdometer,
    endOdometer: b.endOdometer,
  };
}

async function createTrip(req, res, next) {
  try {
    const payload = normalizeTripPayload(req.body);

    if (!payload.vehicle || !payload.driver || payload.cargoWeightKg === undefined) {
      const err = new Error('vehicle, driver and cargoWeightKg are required');
      err.statusCode = 400;
      throw err;
    }

    const cargoWeightKg = Number(payload.cargoWeightKg);
    if (!Number.isFinite(cargoWeightKg) || cargoWeightKg <= 0) {
      const err = new Error('cargoWeightKg must be a positive number');
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await Vehicle.findById(payload.vehicle);
    if (!vehicle) {
      const err = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    const capacityKg = Number(vehicle.maxCapacityKg);
    if (Number.isFinite(capacityKg) && cargoWeightKg > capacityKg) {
      const err = new Error('cargoWeightKg must not exceed vehicle maxCapacityKg');
      err.statusCode = 400;
      throw err;
    }

    const driver = await Driver.findById(payload.driver);
    if (!driver) {
      const err = new Error('Driver not found');
      err.statusCode = 404;
      throw err;
    }

    const trip = await Trip.create({
      vehicle: payload.vehicle,
      driver: payload.driver,
      cargoWeightKg: cargoWeightKg,
      origin: payload.origin,
      destination: payload.destination,
      distanceKm: payload.distanceKm,
      revenue: payload.revenue,
      status: 'DISPATCHED',
      startOdometer: payload.startOdometer,
    });

    await Vehicle.findByIdAndUpdate(payload.vehicle, { status: 'ON_TRIP' });
    await Driver.findByIdAndUpdate(payload.driver, { status: 'ON_DUTY' });

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Trip created',
      data: { trip },
    });
  } catch (e) {
    next(e);
  }
}

async function completeTrip(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      const err = new Error('Trip id is required');
      err.statusCode = 400;
      throw err;
    }

    const trip = await Trip.findById(id);
    if (!trip) {
      const err = new Error('Trip not found');
      err.statusCode = 404;
      throw err;
    }

    const updated = await Trip.findByIdAndUpdate(
      id,
      {
        status: 'COMPLETED',
        ...(req.body?.endOdometer !== undefined ? { endOdometer: req.body.endOdometer } : {}),
      },
      { new: true },
    );

    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'AVAILABLE' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'OFF_DUTY' });

    return sendSuccess(res, {
      message: 'Trip completed',
      data: { trip: updated },
    });
  } catch (e) {
    next(e);
  }
}

async function listTrips(req, res, next) {
  try {
    const trips = await Trip.find({})
      .sort({ createdAt: -1 })
      .populate('vehicle', 'name licensePlate vehicleType status maxCapacityKg odometer')
      .populate('driver', 'name licenseNumber status licenseCategory')
      .lean();

    return sendSuccess(res, {
      message: 'Trips fetched',
      data: { trips },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createTrip,
  completeTrip,
  listTrips,
};
