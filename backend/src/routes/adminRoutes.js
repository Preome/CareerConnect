// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const Company = require("../models/Company");
const DeleteRequest = require("../models/DeleteRequest");

const { auth, isRole } = require("../middleware/authMiddleware");

// Admin login with credentials from .env
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Use credentials from .env
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

    // Check if login matches admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email: ADMIN_EMAIL, role: "admin" },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const adminProfile = {
        email: ADMIN_EMAIL,
        role: "admin",
        name: "Administrator",
      };

      return res.json({ token, user: adminProfile });
    }

    // If credentials don't match
    return res.status(401).json({ message: "Invalid admin credentials" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Protected routes for admin
router.get("/stats", auth, isRole("admin"), async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const employers = await User.countDocuments({ role: "employer" });
    const companies = await Company.countDocuments();
    return res.json({ students, employers, companies });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/users", auth, isRole("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.delete("/delete/:id", auth, isRole("admin"), async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndDelete(id);
    await DeleteRequest.updateMany({ user: id }, { status: "approved" }).catch(() => {});
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.get("/delete-requests", auth, isRole("admin"), async (req, res) => {
  try {
    const requests = await DeleteRequest.find().populate("user", "-password").lean();
    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
