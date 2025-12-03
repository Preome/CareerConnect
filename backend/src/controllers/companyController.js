const Company = require("../models/Company");

// Get company profile by ID
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update company profile
exports.updateCompany = async (req, res) => {
  try {
    const { name, email, website, location, description } = req.body;
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { name, email, website, location, description },
      { new: true }
    );
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a job posting
exports.addJob = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    company.jobs.push({ title, description, location });
    await company.save();
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const companies = await Company.find({}, "name jobs");
    const jobs = [];
    companies.forEach(c => {
      c.jobs.forEach(j => jobs.push({ ...j.toObject(), companyName: c.name, companyId: c._id }));
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const companies = await Company.find();
    for (let c of companies) {
      const job = c.jobs.id(req.params.jobId);
      if (job) {
        return res.json({ ...job.toObject(), companyName: c.name, companyId: c._id });
      }
    }
    res.status(404).json({ message: "Job not found" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
