const express = require("express");
const router = express.Router();
const { auth, isRole } = require("../middleware/authMiddleware");
const AdminController = require("../controllers/adminController");
const User = require("../models/User");
const Company = require("../models/Company");

// Admin login
router.post("/login", AdminController.login);

// Admin dashboard
router.get("/dashboard", auth, isRole("admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

// Get all users
router.get("/users", auth, isRole("admin"), async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all companies
router.get("/companies", auth, isRole("admin"), async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/user/:id", auth, isRole("admin"), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete company
router.delete("/company/:id", auth, isRole("admin"), async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
