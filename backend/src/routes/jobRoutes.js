// backend/routes/jobRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createJob,
  getCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// company creates job
router.post("/", auth, createJob);

// company sees own jobs
router.get("/company", auth, getCompanyJobs);

// get single job by id (only if it belongs to this company)
router.get("/:id", auth, getJobById);

// update job by id
router.put("/:id", auth, updateJob);

// delete job by id
router.delete("/:id", auth, deleteJob);

module.exports = router;
