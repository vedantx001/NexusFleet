const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },

  licenseNumber: { type: String, required: true },

  licenseExpiry: { type: Date, required: true },

  licenseCategory: {
    type: String, // Truck / Van / Bike
    required: true
  },

  safetyScore: { type: Number, default: 100 },

  status: {
    type: String,
    enum: ["ON_DUTY", "OFF_DUTY", "ON_TRIP", "SUSPENDED"],
    default: "OFF_DUTY"
  },

  totalTrips: { type: Number, default: 0 },

  completedTrips: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);