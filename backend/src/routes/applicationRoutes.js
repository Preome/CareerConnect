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
    console.log(`Created directory: ${dir}`);
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Processing file: ${file.fieldname} - ${file.originalname}`);
    if (file.fieldname === "cvImage") {
      cb(null, "uploads/cvs");
    } else if (file.fieldname === "recommendationLetters") {
      cb(null, "uploads/recommendations");
    } else if (file.fieldname === "careerSummary") {
      cb(null, "uploads/summaries");
    } else {
      console.log(`Unknown field: ${file.fieldname}`);
      cb(null, "uploads/cvs"); // Default to cvs folder
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log(`Saving as: ${filename}`);
    cb(null, filename);
  },
});

// File filter to accept images AND PDFs
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = file.mimetype.startsWith("image/");
  const isPDF = file.mimetype === "application/pdf" || ext === ".pdf";

  console.log(
    `File validation - Name: ${file.originalname}, Type: ${file.mimetype}, Extension: ${ext}`
  );

  if (isImage || isPDF) {
    console.log("✓ File accepted");
    cb(null, true);
  } else {
    console.log("✗ File rejected - not an image or PDF");
    cb(new Error("Only image files and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// wrap multer
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
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({
          error: `Upload error: ${err.message}`,
        });
      } else if (err) {
        console.error("Unknown upload error:", err);
        return res.status(400).json({
          error: err.message,
        });
      }
      console.log("Upload successful, proceeding to controller...");
      next();
    });
  },
  applicationController.submitApplication
);

// user applications
router.get("/user", authMiddleware, applicationController.getUserApplications);

// delete application (user)
router.delete(
  "/:applicationId",
  authMiddleware,
  applicationController.deleteApplication
);

// NEW: company candidate list
router.get(
  "/company",
  authMiddleware,
  applicationController.getCompanyApplications
);

// NEW: update application status
router.patch(
  "/:applicationId/status",
  authMiddleware,
  applicationController.updateApplicationStatus
);

module.exports = router;

