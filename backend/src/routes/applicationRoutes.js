const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// Upload middleware configuration
const uploadMiddleware = upload.fields([
  { name: "cvImage", maxCount: 1 },
  { name: "recommendationLetters", maxCount: 5 },
  { name: "careerSummary", maxCount: 5 },
]);

// Submit application
router.post(
  "/apply",
  authMiddleware,
  (req, res, next) => {
    console.log("=== MULTER UPLOAD MIDDLEWARE ===");
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          error: err.message || "File upload failed",
        });
      }
      console.log("Upload successful, proceeding to controller...");
      next();
    });
  },
  applicationController.submitApplication
);

// Get user applications
router.get("/user", authMiddleware, applicationController.getUserApplications);

// Delete application (user)
router.delete(
  "/:applicationId",
  authMiddleware,
  applicationController.deleteApplication
);

// Get company candidate list
router.get(
  "/company",
  authMiddleware,
  applicationController.getCompanyApplications
);

// Update application status
router.patch(
  "/:applicationId/status",
  authMiddleware,
  applicationController.updateApplicationStatus
);

// Delete application (company)
router.delete(
  "/company/:applicationId",
  authMiddleware,
  applicationController.companyDeleteApplication
);

module.exports = router;
