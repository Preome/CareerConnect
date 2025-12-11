// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();

const app = express();

// connect to MongoDB
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// ✅ FIXED: Changed from "/uploads" to "/api/uploads"
app.use("/api/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
