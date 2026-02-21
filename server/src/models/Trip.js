const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true
  },

  cargoWeightKg: { type: Number, required: true },

  origin: String,
  destination: String,

  distanceKm: Number,

  revenue: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"],
    default: "DRAFT"
  },

  startOdometer: Number,
  endOdometer: Number

}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);