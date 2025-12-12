// src/pages/CompanyCandidatesPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyCandidatesPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const avatarUrl = profile?.imageUrl || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/applications/company",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // group applications by job (jobId or jobTitle)
  const groupedByJob = applications.reduce((acc, app) => {
    const key = app.jobId?._id || app.jobId || app.jobTitle;
    if (!acc[key]) {
      acc[key] = {
        jobTitle: app.jobTitle,
        applications: [],
        anyApp: app,
      };
    }
    acc[key].applications.push(app);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* top bar */}
      <header className="w-full flex items-center justify-between px-8 py-3 bg-slate-900 text-white">
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

          <div className="relative">
            <button
              className="text-2xl font-bold"
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white text-gray-800 rounded-md shadow-lg py-2 w-40 z-10">
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
        </div>
      </header>

      <div className="flex flex-1">
        {/* left sidebar */}
        <aside className="w-56 bg-slate-900 text-white pt-6 hidden md:flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center">
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

          <nav className="w-full space-y-1 px-3 text-sm">
            <button
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
              onClick={() => navigate("/company-dashboard")}
            >
              Dashboard
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
              onClick={() => navigate("/company/posted-jobs")}
            >
              Posted Jobs
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded bg-indigo-600"
              onClick={() => navigate("/company/candidates")}
            >
              Candidate list
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
              onClick={() => navigate("/company/messages")}
            >
              Messages
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
              onClick={() => navigate("/company/query-forum")}
            >
              Query Forum
            </button>
            <button
              className="w-full text-left px-4 py-2 rounded hover:bg-slate-800"
              onClick={() => navigate("/company-profile")}
            >
              Profile
            </button>
          </nav>
        </aside>

        {/* main content */}
        <main className="flex-1 bg-gradient-to-b from-slate-200 to-slate-400 py-8 flex justify-center">
          <div className="w-full max-w-5xl mx-4">
            {/* green bar with title above white card */}
            <div className="bg-green-500 text-white px-4 py-2 rounded-t-xl shadow-md mb-0">
              <h2 className="text-lg font-semibold">Jobs and Applicants</h2>
            </div>

            <div className="bg-white rounded-b-xl shadow-2xl p-6 md:p-8">
              {loading ? (
                <p>Loading candidates...</p>
              ) : applications.length === 0 ? (
                <p>No applications yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.values(groupedByJob).map((group) => {
                    const anyApp = group.anyApp;
                    const jobId = anyApp?.jobId?._id || anyApp?.jobId;
                    return (
                      <button
                        key={jobId || group.jobTitle}
                        type="button"
                        onClick={() =>
                          navigate(`/company/jobs/${jobId}/applicants`, {
                            state: { jobTitle: group.jobTitle },
                          })
                        }
                        className="w-full text-left border border-slate-300 rounded-lg p-4 bg-white hover:bg-slate-100 shadow-sm flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm text-pink-600 font-semibold">
                            Job Title
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            {group.jobTitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Applicants</p>
                          <p className="text-xl font-bold text-indigo-600">
                            {group.applications.length}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyCandidatesPage;













