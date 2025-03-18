const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Report = require("../models/Report");

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const report = new Report(req.body);
        await report.save();
        res.status(201).json({ message: "Report submitted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Failed to submit report" });
    }
});

router.get("/", async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch report" });
    }
});

module.exports = router;
