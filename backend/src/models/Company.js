const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    establishmentYear: Number,
    contactNo: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    industryType: String,
    address: String,
    licenseNo: String,
    imageUrl: { type: String }, // <-- add this
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);

