// backend/src/routes/companyRoutes.js
const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/companyController");
const { auth, isRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // multer for images

// -----------------------
// Public routes
// -----------------------

// (Optional) Company registration handled in authRoutes.js
// router.post("/register", upload.single("image"), CompanyController.registerCompany);

// -----------------------
// Protected routes
// -----------------------

// Get logged-in company profile
router.get("/me", auth, isRole("company"), async (req, res) => {
  try {
    const company = await CompanyController.getMyCompany(req.user.id);
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update company info
router.put("/:id", auth, isRole("company"), async (req, res) => {
  try {
    const updatedCompany = await CompanyController.updateCompany(req.params.id, req.body);
    res.json(updatedCompany);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload company image
router.post(
  "/upload-image",
  auth,
  isRole("company"),
  upload.single("image"),
  async (req, res) => {
    try {
      const updatedCompany = await CompanyController.uploadImage(req.user.id, req.file);
      res.json(updatedCompany);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;



