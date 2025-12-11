// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";
import UserProfilePage from "./pages/UserProfilePage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AboutPage from "./pages/AboutPage";

// job‑related pages
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import PostedJobsPage from "./pages/PostedJobsPage";
import ApplyJobPage from "./pages/ApplyJobPage";
import AppliedJobsPage from "./pages/AppliedJobsPage";
import CompanyCandidatesPage from "./pages/CompanyCandidatesPage"; // NEW

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-sky-100">
        <Routes>
          {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<UserRegisterPage />} />
          <Route path="/register-company" element={<CompanyRegisterPage />} />
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
