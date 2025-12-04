// frontend/src/pages/CompanyProfilePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;

  const avatarUrl = profile?.imageUrl || null;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/"); // redirect to homepage
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Top bar */}
      <header className="w-full flex items-center justify-between px-8 py-3 bg-slate-900 text-white relative">
        <h1 className="text-2xl font-semibold">CareerConnect</h1>

        <div className="flex items-center gap-4 relative">
          <div className="flex items-center bg-white rounded-full px-3 py-1">
            <span className="text-gray-500 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          {/* menu button */}
          <button
            className="text-2xl font-bold relative"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          {/* dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-md shadow-lg py-2 w-40 z-10">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/change-password");
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Change password
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left sidebar (same width as dashboard) */}
        <aside className="w-56 bg-slate-900 text-white pt-6">
          <div className="flex flex-col items-center mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Company"
                className="w-16 h-16 rounded-md bg-slate-700 mb-2 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-slate-700 mb-2" />
            )}
            <span className="text-xs text-gray-300">
              {profile?.companyName || profile?.name || "Company"}
            </span>
          </div>

          <nav className="flex flex-col text-sm">
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/company-dashboard")}
            >
              Dashboard
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Posted Jobs
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Candidate list
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Messages
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Query Forum
            </button>
            <button className="text-left px-4 py-2 bg-indigo-600">
              Profile
            </button>
          </nav>
        </aside>

        {/* Main area with company info card */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8">
            <h2 className="text-lg font-semibold mb-6">Company Information</h2>

            <div className="flex justify-center mb-6">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="Company"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>

            {profile && (
              <div className="border rounded-md overflow-hidden text-sm">
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Company Name:</span>
                  <span>{profile.companyName || profile.name}</span>
                </div>
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Phone:</span>
                  <span>{profile.contactNo}</span>
                </div>
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Establishment Year:</span>
                  <span>{profile.establishmentYear}</span>
                </div>
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Industry:</span>
                  <span>{profile.industryType}</span>
                </div>
                <div className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">Address:</span>
                  <span>{profile.address}</span>
                </div>
                <div className="flex px-4 py-2">
                  <span className="w-44 font-medium">License No:</span>
                  <span>{profile.licenseNo}</span>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfilePage;


