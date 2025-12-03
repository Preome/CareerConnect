// frontend/src/App.js 
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboardPage from "./pages/AdminDashboardPage";
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">  {/* FIXED HERE */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<UserRegisterPage />} />
          <Route path="/register-company" element={<CompanyRegisterPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
          <Route path="/user-profile" element={<UserProfilePage />} />
          <Route path="/company-profile" element={<CompanyProfilePage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



