const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  registerUser,
  registerCompany,
  login,
  googleLogin,
  changePassword,
} = require("../controllers/authController");

// user registration WITH image file named "image"
router.post("/register-user", upload.single("image"), registerUser);

// company registration
router.post("/register-company", upload.single("image"), registerCompany);

// login (user or company, based on role in body)
router.post("/login", login);

// google login
router.post("/google-login", googleLogin);

// NEW: change password for logged-in user or company
router.post("/change-password", changePassword);

module.exports = router;



