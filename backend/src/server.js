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

// NO longer need to serve local /uploads because images go to Cloudinary
// app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api/auth", require("./routes/authRoutes"));

// Import admin routes with auth and role-based middleware
const adminRoutes = require("./routes/adminRoutes");
const { auth, isRole } = require("./middleware/authMiddleware"); // updated middleware

// Protect admin routes: only admin role
app.use("/api/admin", auth, isRole("admin"), adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
