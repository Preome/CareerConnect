const multer = require("multer");
const path = require("path");

// where to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // backend/uploads folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext); // e.g. 1700000000-123456789.jpg
  },
});

const upload = multer({ storage });

module.exports = upload;
