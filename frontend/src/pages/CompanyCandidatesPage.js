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

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/applications/${applicationId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // helper to choose status color
  const getStatusClasses = (status) => {
    if (status === "shortlisted")
      return "bg-blue-600 text-white";
    if (status === "hired")
      return "bg-green-600 text-white";
    if (status === "rejected")
      return "bg-red-600 text-white";
    // pending/default
    return "bg-slate-200 text-slate-800";
  };

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
              onClick={() => navigate("/company-profile")}
            >
              Profile
            </button>
          </nav>
        </aside>

        {/* main content */}
        <main className="flex-1 bg-gradient-to-b from-slate-200 to-slate-400 py-8 flex justify-center">
          <div className="w-full max-w-5xl mx-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
              <h2 className="text-xl font-semibold mb-4 text-slate-900">
                Candidate List
              </h2>

              {loading ? (
                <p>Loading candidates...</p>
              ) : applications.length === 0 ? (
                <p>No applications yet.</p>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app._id}
                      className="border border-slate-200 rounded-lg p-4 flex justify-between gap-4"
                    >
                      {/* candidate info */}
                      <div className="flex items-start gap-3 text-sm text-slate-900">
                        {app.userId?.imageUrl ? (
                          <img
                            src={app.userId.imageUrl}
                            alt="Candidate"
                            className="w-12 h-12 rounded-full object-cover mt-1"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-300 mt-1" />
                        )}

                        <div>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Applicant:
                            </span>{" "}
                            {app.userId?.name || "User"}
                          </p>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Email:
                            </span>{" "}
                            {app.userId?.email || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Mobile number:
                            </span>{" "}
                            {app.userId?.mobile || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Student type:
                            </span>{" "}
                            {app.userId?.studentType || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Department:
                            </span>{" "}
                            {app.userId?.department || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold text-pink-700">
                              Job Title:
                            </span>{" "}
                            {app.jobTitle}
                          </p>
                          <p className="mt-1">
                            <span className="font-semibold text-pink-700">
                              Status:
                            </span>{" "}
                            <span
                              className={`uppercase text-xs px-2 py-1 rounded ${getStatusClasses(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </p>

                          {app.cvImage && (
                            <p className="mt-1">
                              <span className="font-semibold text-pink-700">
                                CV:
                              </span>{" "}
                              <a
                                href={`http://localhost:5000/${app.cvImage}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 underline text-xs"
                              >
                                View CV
                              </a>
                            </p>
                          )}

                          {app.recommendationLetters &&
                            app.recommendationLetters.length > 0 && (
                              <p className="mt-1">
                                <span className="font-semibold text-pink-700">
                                  Recommendations:
                                </span>{" "}
                                {app.recommendationLetters.map((file, idx) => (
                                  <a
                                    key={idx}
                                    href={`http://localhost:5000/${file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 underline text-xs mr-2"
                                  >
                                    Doc {idx + 1}
                                  </a>
                                ))}
                              </p>
                            )}

                          {app.careerSummary &&
                            app.careerSummary.length > 0 && (
                              <p className="mt-1">
                                <span className="font-semibold text-pink-700">
                                  Career Summary:
                                </span>{" "}
                                {app.careerSummary.map((file, idx) => (
                                  <a
                                    key={idx}
                                    href={`http://localhost:5000/${file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-indigo-600 underline text-xs mr-2"
                                  >
                                    Doc {idx + 1}
                                  </a>
                                ))}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* status buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-xs"
                          onClick={() => updateStatus(app._id, "shortlisted")}
                        >
                          Shortlist
                        </button>
                        <button
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-xs"
                          onClick={() => updateStatus(app._id, "hired")}
                        >
                          Hire
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-xs"
                          onClick={() => updateStatus(app._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
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







