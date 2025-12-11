const Application = require("../models/Application");
const JobModel = require("../models/JobModel");

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    console.log("=== APPLICATION SUBMISSION STARTED ===");
    console.log("User ID:", req.user.id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { jobId, companyId, companyName, jobTitle } = req.body;
    const userId = req.user.id;

    // CV validation
    console.log("Checking for CV upload...");

    if (!req.files) {
      console.log("ERROR: No files in request");
      return res.status(400).json({
        error: "No files uploaded. Please upload your CV to continue.",
      });
    }

    console.log("Files object exists. Checking cvImage field...");
    console.log("cvImage field:", req.files.cvImage);

    if (!req.files.cvImage || req.files.cvImage.length === 0) {
      console.log("ERROR: CV field is empty or missing");
      console.log("Available fields:", Object.keys(req.files));
      return res.status(400).json({
        error:
          "Sorry! without uploading your own Curriculum Vitae, you cannot apply for this company",
      });
    }

    console.log("CV uploaded successfully:", req.files.cvImage[0].originalname);

    // Check already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      console.log("ERROR: User already applied for this job");
      return res.status(400).json({
        error: "You have already applied for this job",
      });
    }

    // Get uploaded file paths
    const cvImage = req.files.cvImage[0].path;
    console.log("CV file path:", cvImage);

    const recommendationLetters = req.files.recommendationLetters
      ? req.files.recommendationLetters.map((file) => {
          console.log("Recommendation letter:", file.originalname);
          return file.path;
        })
      : [];

    const careerSummary = req.files.careerSummary
      ? req.files.careerSummary.map((file) => {
          console.log("Career summary:", file.originalname);
          return file.path;
        })
      : [];

    console.log("Creating application in database...");

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

    console.log("Application saved successfully! ID:", application._id);
    console.log("=== APPLICATION SUBMISSION COMPLETED ===");

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("=== APPLICATION SUBMISSION ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Failed to submit application",
      message: error.message,
    });
  }
};

// Get user's applications
exports.getUserApplications = async (req, res) => {
  try {
    console.log("Fetching applications for user:", req.user.id);
    const userId = req.user.id;

    const applications = await Application.find({ userId })
      .populate("jobId")
      .populate("companyId")
      .sort({ createdAt: -1 });

    console.log(`Found ${applications.length} applications for user`);

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
      message: error.message,
    });
  }
};

// Delete application (user side)
exports.deleteApplication = async (req, res) => {
  try {
    console.log("=== DELETE APPLICATION STARTED ===");
    const { applicationId } = req.params;
    const userId = req.user.id;

    console.log("Application ID:", applicationId);
    console.log("User ID:", userId);

    const application = await Application.findById(applicationId);

    if (!application) {
      console.log("ERROR: Application not found");
      return res.status(404).json({
        error: "Application not found",
      });
    }

    console.log("Application found. Owner:", application.userId);

    if (application.userId.toString() !== userId) {
      console.log("ERROR: Unauthorized deletion attempt");
      return res.status(403).json({
        error: "You are not authorized to delete this application",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    console.log("Application deleted successfully!");
    console.log("=== DELETE APPLICATION COMPLETED ===");

    res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("=== DELETE APPLICATION ERROR ===");
    console.error("Error details:", error);
    res.status(500).json({
      error: "Failed to delete application",
      message: error.message,
    });
  }
};

// Get applications for a company (candidate list)
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user.id; // company logged in

    const applications = await Application.find({ companyId })
      .populate(
        "userId",
        "name email department studentType imageUrl mobile"
      )
      .populate("jobId", "title category department")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching company applications:", error);
    res.status(500).json({
      error: "Failed to fetch candidates",
      message: error.message,
    });
  }
};

// Update application status (pending / shortlisted / hired / rejected)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const companyId = req.user.id;

    const allowed = ["pending", "shortlisted", "hired", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findOne({
      _id: applicationId,
      companyId,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({ message: "Status updated", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      error: "Failed to update status",
      message: error.message,
    });
  }
};

// Delete application (company side)
exports.companyDeleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const companyId = req.user.id;

    const application = await Application.findOne({
      _id: applicationId,
      companyId,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    await Application.findByIdAndDelete(applicationId);

    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Company delete application error:", error);
    res.status(500).json({
      error: "Failed to delete application",
      message: error.message,
    });
  }
};
