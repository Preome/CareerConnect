// backend/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const applicationController = require("../controllers/applicationController");

// Apply for a job with file uploads
router.post(
  "/apply",
  auth,
  upload.fields([
    { name: "cvImage", maxCount: 1 },
    { name: "recommendationLetters", maxCount: 10 },
    { name: "careerSummary", maxCount: 10 },
  ]),
  applicationController.applyForJob
);

// Get user's applications
router.get("/user", auth, applicationController.getUserApplications);

// Delete application
router.delete("/:id", auth, applicationController.deleteApplication);

module.exports = router;
