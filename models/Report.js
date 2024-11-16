const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  diagnostics: [{ area: String, issue: String, severity: String }],
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Report", reportSchema);
