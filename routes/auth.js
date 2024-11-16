const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

const validateuser = async (email, username) => {
    if (email) {
      return await User.findOne({ email });
    } else if (username) {
      return await User.findOne({ username });
    }
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, username, password, role } = req.body;

    let user = await validateuser(email, username);
    if (user) return res.status(400).json({ error: "User already exists" });

    user = new User({ name, username, email, password, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await validateuser(email, username);
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(400).json({ error: "Login failed " + error });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out" });
});

module.exports = router;
