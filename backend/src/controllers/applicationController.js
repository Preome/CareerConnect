// backend/src/controllers/applicationController.js
const Application = require("../models/Application");
const fs = require("fs");
const path = require("path");

// Submit a job application
exports.submitApplication = async (req, res) => {
  try {
    const { jobId, companyId, companyName, jobTitle } = req.body;
    const userId = req.user.id;

    // Validate CV is uploaded
    if (!req.files || !req.files.cvImage || req.files.cvImage.length === 0) {
      return res.status(400).json({ error: "CV is required" });
    }

    // Get file paths
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
      careerSummary,
    });

    await application.save();

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ error: "Failed to submit application" });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("companyId", "companyName imageUrl name")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    // Find the application
    const application = await Application.findOne({
      _id: applicationId,
      userId: userId,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Delete uploaded files from filesystem
    const deleteFile = (filePath) => {
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Error deleting file ${filePath}:`, err);
        }
      }
    };

    // Delete CV
    deleteFile(application.cvImage);

    // Delete recommendation letters
    if (application.recommendationLetters && application.recommendationLetters.length > 0) {
      application.recommendationLetters.forEach((file) => deleteFile(file));
    }

    // Delete career summary files
    if (application.careerSummary && application.careerSummary.length > 0) {
      application.careerSummary.forEach((file) => deleteFile(file));
    }

    // Delete application from database
    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ error: "Failed to delete application" });
  }
};
