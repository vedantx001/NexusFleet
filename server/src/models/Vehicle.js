const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Van-05

  model: String,

  licensePlate: {
    type: String,
    required: true,
    unique: true
  },

  vehicleType: {
    type: String,
    enum: ["TRUCK", "VAN", "BIKE"],
    required: true
  },

  maxCapacityKg: { type: Number, required: true },

  odometer: { type: Number, default: 0 },

  acquisitionCost: { type: Number, required: true },

  status: {
    type: String,
    enum: ["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"],
    default: "AVAILABLE"
  },

  region: String

}, { timestamps: true });

module.exports = mongoose.model("Vehicle", vehicleSchema);