const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/notificationController");

router.get("/", auth, controller.getUserNotifications);
router.patch("/:id/read", auth, controller.markAsRead);

module.exports = router;
