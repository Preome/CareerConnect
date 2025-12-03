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
    imageUrl: { type: String },        // company logo / image
    description: String,               // optional company description
    jobs: [                             // job postings for Feature 2
      {
        title: String,
        description: String,
        location: String,
        _id: false,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);


