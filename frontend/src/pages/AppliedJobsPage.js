// frontend/src/pages/AppliedJobsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AppliedJobsPage = () => {
  const navigate = useNavigate();
  
  // Get user profile
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const avatarUrl = profile?.imageUrl || null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullImageView, setFullImageView] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/applications/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Refresh the applications list
      await fetchApplications();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting application:", err);
      alert("Failed to delete application. Please try again.");
    }
  };

  const openFile = (filePath) => {
    const fileUrl = `http://localhost:5000/${filePath}`;
    const fileExtension = filePath.split('.').pop().toLowerCase();
    
    if (fileExtension === 'pdf') {
      // Open PDF in new tab
      window.open(fileUrl, '_blank');
    } else {
      // Show image in modal
      setFullImageView(fileUrl);
    }
  };

  const isFilePDF = (filePath) => {
    return filePath && filePath.toLowerCase().endsWith('.pdf');
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* Full Image View Modal */}
      {fullImageView && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-screen">
            <button
              onClick={() => setFullImageView(null)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold z-10"
            >
              Exit
            </button>
            <img
              src={fullImageView}
              alt="Full View"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this application? This action cannot be undone.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteApplication(deleteConfirm)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

          <button
            className="text-2xl font-bold relative"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

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
        <aside className="w-52 bg-slate-900 text-white pt-6 sticky top-0 self-start h-screen">
          <div className="flex flex-col items-center mb-6">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-14 h-14 rounded bg-slate-700 mb-2 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded bg-slate-700 mb-2" />
            )}
            <span className="text-xs text-gray-300">
              {profile?.name || "User"}
            </span>
          </div>

          <nav className="flex flex-col text-sm">
            <button 
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/user-dashboard")}
            >
              Home
            </button>
            <button 
              className="text-left px-4 py-2 bg-indigo-600"
              onClick={() => navigate("/applied-jobs")}
            >
              Applied Jobs
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Followed Jobs
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Messages
            </button>
            <button className="text-left px-4 py-2 hover:bg-slate-800">
              Query Forum
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/user-profile")}
            >
              Profile
            </button>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Success Message */}
            {applications.length > 0 && (
              <div className="bg-blue-100 border border-blue-400 text-blue-800 px-6 py-4 rounded-lg mb-6 text-center">
                <h2 className="text-xl font-bold">
                  You have successfully applied for a job using our website!!
                </h2>
              </div>
            )}

            {/* Applied Jobs List */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                List of your applied jobs:
              </h2>

              {loading ? (
                <p className="text-gray-600 text-center py-12">Loading your applications...</p>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-2xl font-semibold text-gray-600">
                    You Haven't applied for any jobs
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app, index) => (
                    <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className="flex items-center justify-between">
                        {/* Left side - Number, Logo, Company Info */}
                        <div className="flex items-center flex-1">
                          <span className="text-2xl font-bold text-gray-800 mr-4">
                            {index + 1}.
                          </span>
                          
                          <div className="bg-slate-800 text-white rounded-md shadow-md flex items-center h-16 px-5 mr-4">
                            <div className="w-12 h-12 bg-blue-400 rounded-md flex items-center justify-center overflow-hidden">
                              {app.companyId?.imageUrl ? (
                                <img
                                  src={app.companyId.imageUrl}
                                  alt={app.companyName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold text-xl">
                                  {app.companyName?.[0]?.toUpperCase() || "C"}
                                </span>
                              )}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold">
                                {app.companyName}
                              </h3>
                            </div>
                          </div>

                          {/* Job Title */}
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Job Title:</p>
                            <p className="text-base font-semibold text-gray-800">
                              {app.jobTitle}
                            </p>
                          </div>
                        </div>

                        {/* Right side - Apply Date & Delete Button */}
                        <div className="text-right ml-4">
                          <p className="text-sm font-semibold text-pink-700">
                            Apply Date: {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(app.createdAt).toLocaleTimeString()}
                          </p>
                          <button
                            onClick={() => setDeleteConfirm(app._id)}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm font-semibold"
                          >
                            Delete Application
                          </button>
                        </div>
                      </div>

                      {/* View Application Details Button */}
                      <div className="mt-4 border-t pt-4">
                        <button
                          onClick={() => setSelectedApplication(
                            selectedApplication === app._id ? null : app._id
                          )}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                        >
                          {selectedApplication === app._id ? "Hide Details ▲" : "View Uploaded Documents ▼"}
                        </button>

                        {/* Application Details */}
                        {selectedApplication === app._id && (
                          <div className="mt-4 space-y-4">
                            {/* CV */}
                            <div>
                              <h4 className="font-semibold text-gray-700 mb-2">
                                Curriculum Vitae (CV):
                              </h4>
                              {isFilePDF(app.cvImage) ? (
                                <div 
                                  onClick={() => openFile(app.cvImage)}
                                  className="w-48 h-48 border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                >
                                  <svg className="w-20 h-20 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                  </svg>
                                  <p className="text-sm font-semibold text-gray-700 mt-2">CV.pdf</p>
                                  <p className="text-xs text-gray-500">Click to view PDF</p>
                                </div>
                              ) : (
                                <img
                                  src={`http://localhost:5000/${app.cvImage}`}
                                  alt="CV"
                                  className="w-48 h-48 object-contain border rounded cursor-pointer hover:opacity-80 transition"
                                  onClick={() => openFile(app.cvImage)}
                                />
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Click to {isFilePDF(app.cvImage) ? 'view PDF' : 'view full image'}
                              </p>
                            </div>

                            {/* Recommendation Letters */}
                            {app.recommendationLetters && app.recommendationLetters.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                  Recommendation Letters ({app.recommendationLetters.length}):
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                  {app.recommendationLetters.map((letter, idx) => (
                                    <div key={idx}>
                                      {isFilePDF(letter) ? (
                                        <div 
                                          onClick={() => openFile(letter)}
                                          className="w-32 h-32 border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                        >
                                          <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                          </svg>
                                          <p className="text-xs text-gray-600 mt-1">PDF</p>
                                        </div>
                                      ) : (
                                        <img
                                          src={`http://localhost:5000/${letter}`}
                                          alt={`Recommendation ${idx + 1}`}
                                          className="w-32 h-32 object-contain border rounded cursor-pointer hover:opacity-80 transition"
                                          onClick={() => openFile(letter)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Click on any file to view
                                </p>
                              </div>
                            )}

                            {/* Career Summary */}
                            {app.careerSummary && app.careerSummary.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                  Career Summary ({app.careerSummary.length}):
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                  {app.careerSummary.map((summary, idx) => (
                                    <div key={idx}>
                                      {isFilePDF(summary) ? (
                                        <div 
                                          onClick={() => openFile(summary)}
                                          className="w-32 h-32 border rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
                                        >
                                          <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                          </svg>
                                          <p className="text-xs text-gray-600 mt-1">PDF</p>
                                        </div>
                                      ) : (
                                        <img
                                          src={`http://localhost:5000/${summary}`}
                                          alt={`Career Summary ${idx + 1}`}
                                          className="w-32 h-32 object-contain border rounded cursor-pointer hover:opacity-80 transition"
                                          onClick={() => openFile(summary)}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Click on any file to view
                                </p>
                              </div>
                            )}
                          </div>
                        )}
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

export default AppliedJobsPage;
