// backend/src/controllers/applicationController.js
const Application = require("../models/Application");
const JobModel = require("../models/JobModel");

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, companyId, companyName, jobTitle } = req.body;
    const userId = req.user.id;

    // Check if CV image is uploaded
    if (!req.files || !req.files.cvImage || req.files.cvImage.length === 0) {
      return res.status(400).json({
        error: "Sorry! without uploading your own Curriculum Vitae, you cannot apply for this company"
      });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({
        error: "You have already applied for this job"
      });
    }

    // Get uploaded file paths
    const cvImage = req.files.cvImage[0].path;
    const recommendationLetters = req.files.recommendationLetters
      ? req.files.recommendationLetters.map((file) => file.path)
      : [];
    const careerSummary = req.files.careerSummary
      ? req.files.careerSummary.map((file) => file.path)
      : [];

    // Create application
    const application = new Application({
      userId,
      jobId,
      companyId,
      companyName,
      jobTitle,
      cvImage,
      recommendationLetters,
      careerSummary
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({
      error: "Failed to submit application",
      message: error.message
    });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("jobId")
      .populate("companyId")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
      message: error.message
    });
  }
};
