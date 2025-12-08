const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    studentType: { type: String },
    department: { type: String },
    imageUrl: { type: String },
    
    // NEW PROFILE FIELDS
    currentAddress: { type: String, default: "" },
    academicBackground: { type: String, default: "" },
    cgpa: { type: Number, default: null },
    skills: { type: String, default: "" },
    university: { type: String, default: "" },
    certificateUrl: { type: String, default: "" },
    cvUrl: { type: String, default: "" },
    projectLink: { type: String, default: "" },
    linkedinLink: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

