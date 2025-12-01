import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CompanyDashboardPage = () => {
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
        {/* Left sidebar */}
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
            <button className="text-left px-4 py-2 bg-indigo-600">
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
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/company-profile")}
            >
              Profile
            </button>
          </nav>
        </aside>

        {/* Main area (dashboard content) */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 flex">
          <div className="w-full mt-6 px-6">
            <div className="bg-white shadow-lg rounded-md p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Welcome to Dashboard
                </h2>
                <p className="text-sm text-gray-600">
                  Start Your Journey by sharing your first post!
                </p>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow">
                Add Job post
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;




