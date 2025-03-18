const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
);

router.get("/mehcanics", async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["mechanic", "admin"] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/clients", async (req, res) => {
  try {
    const users = await User.find({ role: "client" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
