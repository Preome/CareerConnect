const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Admin = require("../models/admin");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const exists = await Admin.findOne({ email: "admin@example.com" });
    if (exists) {
      console.log("Admin already exists!");
      return mongoose.disconnect();
    }

    const admin = new Admin({
      email: "admin@example.com",
      password: "admin123"
    });

    await admin.save();
    console.log("Admin created successfully!");
    mongoose.disconnect();
  })
  .catch(err => console.log(err));
