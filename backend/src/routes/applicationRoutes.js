// backend/src/routes/applicationRoutes.js
const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directories if they don't exist
const uploadDirs = ["uploads/cvs", "uploads/recommendations", "uploads/summaries"];
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cvImage") {
      cb(null, "uploads/cvs");
    } else if (file.fieldname === "recommendationLetters") {
      cb(null, "uploads/recommendations");
    } else if (file.fieldname === "careerSummary") {
      cb(null, "uploads/summaries");
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs for all three fields
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error("Only image files and PDFs are allowed"));
    }
  }
});

// Routes
router.post(
  "/apply",
  authMiddleware,
  upload.fields([
    { name: "cvImage", maxCount: 1 },
    { name: "recommendationLetters", maxCount: 5 },
    { name: "careerSummary", maxCount: 5 }
  ]),
  applicationController.submitApplication
);

router.get("/user", authMiddleware, applicationController.getUserApplications);

// DELETE route - Delete an application
router.delete("/:applicationId", authMiddleware, applicationController.deleteApplication);

module.exports = router;
