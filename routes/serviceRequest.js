const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Vehicle = require("../models/Vehicle"); // Import the Vehicle model
const ServiceRequest = require("../models/ServiceRequest");
const passport = require("passport");
const Report = require("../models/Report");
const User = require("../models/User");

const router = express.Router();

router.post("/create", async (req, res) => {
  console.log(res.body);
  try {
    const { mechanicId, ownerId, serviceType, description } = req.body;
    const { make, model, year, vin } = req.body;

    const vehicle = {
      make,
      model,
      year,
      vin,
    };
    // Find the mechanic by email or other identifier
    const mechanic = await User.findOne({ _id: mechanicId });
    if (!mechanic) {
      return res.status(404).json({ error: "Mechanic not found" });
    }

    // Find the owner (user) by email or other identifier
    const owner = await User.findOne({ username: ownerId });
    console.log("Owner: ", owner);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }

    // Check if the user already has the vehicle
    let vehicleRecord = await Vehicle.findOne({
      owner: owner._id,
      ...vehicle,
    })
      .then((vehicle) => {
        if (!vehicle) {
          console.log("Vehicle not found. Proceeding to create a new one...");
          return null;
        }
        return vehicle;
      })
      .catch((error) => {
        console.error("Error while fetching vehicle:", error.message);
        // Optional: Continue execution or handle error as needed
        return null;
      });

    // If vehicle doesn't exist, create a new one
    if (vehicleRecord === null) {
      vehicleRecord = new Vehicle({
        ...vehicle,
        ownerId: owner._id,
      });
      await vehicleRecord.save();
    }
    if (vehicleRecord !== null) {
      console.log("Vehicle record:", vehicleRecord);
      const requestData = {
        vehicleId: vehicleRecord._id,
        mechanicId,
        owner: owner._id,
        serviceType: serviceType,
        description: description,
        date: Date.now(),
      };
      const serviceRequest = new ServiceRequest(requestData);
      await serviceRequest.save();

      const reportData = {
        vehicleId: vehicleRecord._id,
        mechanicId,
        diagnostics: [],
        serviceRequestId: serviceRequest._id,
        date: Date.now(),
      };
      const report = new Report(reportData);
      await report.save();

      res
        .status(201)
        .json({ message: "Service request submitted successfully" });
    } else {
      res.status(400).json({ error: "Failed to submit service request" });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to submit service request " + err });
  }
});

router.get("/", async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find();
    res.json(serviceRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

// get request by user
router.get("/user", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId query parameter" });
    }
    const serviceRequests = await ServiceRequest.find({ owner: userId });
    res.json(serviceRequests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

// get request by id
router.get("/:id", async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findById(req.params.id);
    res.json(serviceRequest);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service request" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const serviceRequest = await ServiceRequest.findByIdAndDelete(
      req.params.id,
    );
    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    } else {
      const report = await Report.findOneAndDelete({
        serviceRequestId: serviceRequest._id,
      });
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
    }
    res.json({ message: "Service request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service request" });
  }
});

module.exports = router;
