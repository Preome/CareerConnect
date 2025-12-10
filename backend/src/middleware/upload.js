const multer = require("multer");


// Store uploaded files in memory as Buffer objects.
// The controller will take req.file.buffer and send it to Cloudinary.
const storage = multer.memoryStorage();


const upload = multer({
  storage,
  // optional: add basic limits or file filters if you want
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype.startsWith("image/")) cb(null, true);
  //   else cb(new Error("Only image files are allowed"), false);
  // },
});


module.exports = upload;
