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

module.exports = router;
