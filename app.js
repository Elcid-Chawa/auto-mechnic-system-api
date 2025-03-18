require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());
// Passport Config
require("./config/passport")(passport);
app.use(passport.initialize());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));;

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/serviceRequest", require("./routes/serviceRequest"));
app.use("/api/vehicles", require("./routes/vehicles"));

module.exports = app;
