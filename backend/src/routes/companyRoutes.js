const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer for images

// Get logged-in company profile
router.get("/me", verifyToken, companyController.getMyCompany);

// Update company info
router.put("/:id", verifyToken, companyController.updateCompany);

// Upload company image
router.post(
  "/upload-image",
  verifyToken,
  upload.single("image"),
  companyController.uploadImage
);

module.exports = router;


