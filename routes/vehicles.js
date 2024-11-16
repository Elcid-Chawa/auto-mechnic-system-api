const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Vehicle = require("../models/Vehicle");
const passport = require("passport");

const router = express.Router();

router.post("/create", passport.authenticate("jwt", { session: false }),  async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).json({ message: "Report submitted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to submit report" });
  }
});

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
});

// update vehicle
router.put("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to update vehicle" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { vin } = req.query;
    const vehicle = await Vehicle.findOne({ vin });
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vehicle" });
  }
});

module.exports = router;
