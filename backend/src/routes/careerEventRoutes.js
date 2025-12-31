// backend/src/routes/careerEventRoutes.js
const express = require("express");
const router = express.Router();
const careerEventController = require("../controllers/careerEventController");
const { auth, isRole } = require("../middleware/authMiddleware"); // ✅ FIXED!
const upload = require("../middleware/upload");

// ✅ NEW: Upload event cover image (MUST BE BEFORE /:id routes!)
router.post(
  "/upload-event-cover",
  auth,
  isRole("company"),
  upload.single("image"),
  careerEventController.uploadEventCover
);

// Get all events for logged-in company
router.get("/company", auth, isRole("company"), careerEventController.getCompanyEvents);

// Create a new career event
router.post("/", auth, isRole("company"), careerEventController.createCareerEvent);

// Get single event by ID
router.get("/:id", auth, isRole("company"), careerEventController.getCareerEventById);

// Update career event
router.put("/:id", auth, isRole("company"), careerEventController.updateCareerEvent);

// Delete career event
router.delete("/:id", auth, isRole("company"), careerEventController.deleteCareerEvent);

module.exports = router;
