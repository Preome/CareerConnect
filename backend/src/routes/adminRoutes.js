const express = require("express");
const router = express.Router();
const { auth, isRole } = require("../middleware/authMiddleware");
const AdminController = require("../controllers/adminController");
const User = require("../models/User");
const Company = require("../models/Company");
const Job = require("../models/Job"); // Add your Job model

// Admin login
router.post("/login", AdminController.login);

// Admin dashboard
router.get("/dashboard", auth, isRole("admin"), (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.email}` });
});

// Get all users
router.get("/users", auth, isRole("admin"), async (req, res) => {
  try {
    const users = await User.find({}); // fetch all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all companies
router.get("/companies", auth, isRole("admin"), async (req, res) => {
  try {
    const companies = await Company.find({}); // fetch all companies
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending requests (example: companies waiting approval)
router.get("/pending", auth, isRole("admin"), async (req, res) => {
  try {
    const pendingCompanies = await Company.find({ status: "pending" });
    const pendingUsers = await User.find({ requestPending: true });
    res.json({ pendingCompanies, pendingUsers });
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

// Delete job post (new)
router.delete("/job/:id", auth, isRole("admin"), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve or reject pending request (new)
router.patch("/pending/:id", auth, isRole("admin"), async (req, res) => {
  const { action } = req.body; // expect 'approve' or 'reject'
  try {
    const pendingCompany = await Company.findById(req.params.id);
    const pendingUser = await User.findById(req.params.id);

    if (pendingCompany) {
      pendingCompany.status = action === "approve" ? "approved" : "rejected";
      await pendingCompany.save();
      return res.json({ message: `Company ${action}d successfully` });
    }

    if (pendingUser) {
      pendingUser.requestPending = action === "approve" ? false : true;
      await pendingUser.save();
      return res.json({ message: `User request ${action}d successfully` });
    }

    res.status(404).json({ message: "Pending item not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
