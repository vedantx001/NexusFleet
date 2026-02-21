const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true
  },

  description: String,

  cost: { type: Number, required: true },

  serviceDate: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ["OPEN", "COMPLETED"],
    default: "OPEN"
  }

}, { timestamps: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);