// frontend/src/App.js 
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AboutPage from "./pages/AboutPage";

<<<<<<< HEAD
=======
// job‑related pages
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import PostedJobsPage from "./pages/PostedJobsPage";
import ApplyJobPage from "./pages/ApplyJobPage";
import AppliedJobsPage from "./pages/AppliedJobsPage";
import CompanyCandidatesPage from "./pages/CompanyCandidatesPage"; // NEW
import JobApplicantsPage from "./pages/JobApplicantsPage";

// inside <Routes>:



>>>>>>> combinejobuser
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">  {/* FIXED HERE */}
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<UserRegisterPage />} />
          <Route path="/register-company" element={<CompanyRegisterPage />} />
<<<<<<< HEAD
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-panel" element={<AdminPanelPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/company-profile" element={<CompanyProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
=======
>>>>>>> combinejobuser
          <Route path="/about" element={<AboutPage />} />

          {/* user routes */}
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/apply-job/:jobId" element={<ApplyJobPage />} />
          <Route path="/applied-jobs" element={<AppliedJobsPage />} />

          {/* company routes */}
          <Route
            path="/company-dashboard"
            element={<CompanyDashboardPage />}
          />
          <Route path="/company-profile" element={<CompanyProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route
            path="/company/candidates"
            element={<CompanyCandidatesPage />}
          />
          <Route
            path="/company/jobs/:jobId/applicants"
            element={<JobApplicantsPage />}
          />
          {/* company job features */}
          <Route path="/company/jobs/new" element={<AddJobPage />} />
          <Route path="/company/jobs/:id/edit" element={<EditJobPage />} />
          <Route path="/company/posted-jobs" element={<PostedJobsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
