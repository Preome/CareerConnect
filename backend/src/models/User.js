const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    studentType: { type: String }, // e.g. Undergrad, Postgrad
    department: { type: String },
    imageUrl: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
