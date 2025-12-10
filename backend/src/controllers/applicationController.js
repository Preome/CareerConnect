// backend/controllers/applicationController.js
const Application = require("../models/Application");
const path = require("path");
const fs = require("fs");

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, companyId, companyName, jobTitle } = req.body;
    const userId = req.user.id;

    // Check if CV is uploaded
    if (!req.files || !req.files.cvImage || req.files.cvImage.length === 0) {
      return res.status(400).json({
        error: "Sorry! without uploading your own Curriculum Vitae, you cannot apply for this company"
      });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      userId,
      jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        error: "You have already applied for this job",
      });
    }

    // Get file paths
    const cvImage = req.files.cvImage[0].path;
    const recommendationLetters = req.files.recommendationLetters
      ? req.files.recommendationLetters.map((file) => file.path)
      : [];
    const careerSummary = req.files.careerSummary
      ? req.files.careerSummary.map((file) => file.path)
      : [];

    // Create new application
    const application = new Application({
      userId,
      jobId,
      companyId,
      companyName,
      jobTitle,
      cvImage,
      recommendationLetters,
      careerSummary,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({
      error: "Failed to submit application",
      details: error.message,
    });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("companyId", "name imageUrl")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
};

// Delete application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the application
    const application = await Application.findOne({ _id: id, userId });

    if (!application) {
      return res.status(404).json({
        error: "Application not found or you don't have permission to delete it",
      });
    }

    // Delete uploaded files
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    };

    // Delete CV
    deleteFile(application.cvImage);

    // Delete recommendation letters
    if (application.recommendationLetters) {
      application.recommendationLetters.forEach((file) => deleteFile(file));
    }

    // Delete career summary
    if (application.careerSummary) {
      application.careerSummary.forEach((file) => deleteFile(file));
    }

    // Delete the application from database
    await Application.findByIdAndDelete(id);

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({
      error: "Failed to delete application",
      details: error.message,
    });
  }
};
