import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserRegisterPage from "./pages/UserRegisterPage";
import CompanyRegisterPage from "./pages/CompanyRegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import CompanyDashboardPage from "./pages/CompanyDashboardPage";



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-sky-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-user" element={<UserRegisterPage />} />
          <Route path="/register-company" element={<CompanyRegisterPage />} />
          <Route path="/user-dashboard" element={<UserDashboardPage />} />
          <Route path="/company-dashboard" element={<CompanyDashboardPage />} />


        </Routes>
      </div>
    </Router>
  );
}

export default App;
