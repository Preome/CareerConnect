// frontend/src/pages/ApplyJobPage.js
import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const ApplyJobPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const location = useLocation();
  
  const { companyName, companyId, jobTitle } = location.state || {};

  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const avatarUrl = profile?.imageUrl || null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [cvFileType, setCvFileType] = useState(null);
  const [recommendationLetters, setRecommendationLetters] = useState([]);
  const [recommendationPreviews, setRecommendationPreviews] = useState([]);
  const [recommendationTypes, setRecommendationTypes] = useState([]);
  const [careerSummary, setCareerSummary] = useState([]);
  const [careerSummaryPreviews, setCareerSummaryPreviews] = useState([]);
  const [careerSummaryTypes, setCareerSummaryTypes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullImageView, setFullImageView] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setCvFileType(file.type);
      
      if (file.type === 'application/pdf') {
        setCvPreview(null);
      } else {
        setCvPreview(URL.createObjectURL(file));
      }
      setError("");
    }
  };

  const handleRecommendationUpload = (e) => {
    const files = Array.from(e.target.files);
    setRecommendationLetters((prev) => [...prev, ...files]);
    
    const previews = files.map(file => {
      if (file.type === 'application/pdf') {
        return null;
      }
      return URL.createObjectURL(file);
    });
    setRecommendationPreviews((prev) => [...prev, ...previews]);
    
    const types = files.map(file => file.type);
    setRecommendationTypes((prev) => [...prev, ...types]);
  };

  const handleCareerSummaryUpload = (e) => {
    const files = Array.from(e.target.files);
    setCareerSummary((prev) => [...prev, ...files]);
    
    const previews = files.map(file => {
      if (file.type === 'application/pdf') {
        return null;
      }
      return URL.createObjectURL(file);
    });
    setCareerSummaryPreviews((prev) => [...prev, ...previews]);
    
    const types = files.map(file => file.type);
    setCareerSummaryTypes((prev) => [...prev, ...types]);
  };

  const removeFile = (type, index) => {
    if (type === "recommendation") {
      setRecommendationLetters((prev) => prev.filter((_, i) => i !== index));
      setRecommendationPreviews((prev) => prev.filter((_, i) => i !== index));
      setRecommendationTypes((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "summary") {
      setCareerSummary((prev) => prev.filter((_, i) => i !== index));
      setCareerSummaryPreviews((prev) => prev.filter((_, i) => i !== index));
      setCareerSummaryTypes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      setError(
        "Sorry! without uploading your own Curriculum Vitae, you cannot apply for this company"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("companyId", companyId);
      formData.append("companyName", companyName);
      formData.append("jobTitle", jobTitle);
      formData.append("cvImage", cvFile);

      recommendationLetters.forEach((file) => {
        formData.append("recommendationLetters", file);
      });

      careerSummary.forEach((file) => {
        formData.append("careerSummary", file);
      });

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/applications/apply",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Application submitted successfully:", response.data);
      navigate("/applied-jobs");
    } catch (err) {
      console.error("Error submitting application:", err);
      setError(
        err.response?.data?.error || "Failed to submit application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
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
              className="text-left px-4 py-2 hover:bg-slate-800"
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

        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-pink-700">
                Apply Easily For Your Job!!
              </h1>
              <button
                onClick={() => navigate("/user-dashboard")}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold"
              >
                Cancel
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Drop Your CV Please:
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    (upload your file as photo or PDF)
                  </p>
                  <label className="flex flex-col items-center justify-center bg-gray-200 hover:bg-gray-300 border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer transition">
                    <svg
                      className="w-12 h-12 text-gray-600 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">
                      Add Photos or PDF
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {cvFile && (
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      CV Preview:
                    </p>
                    {cvFileType === 'application/pdf' ? (
                      <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded">
                        <svg className="w-16 h-16 text-red-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">{cvFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">PDF File</p>
                      </div>
                    ) : (
                      <img
                        src={cvPreview}
                        alt="CV Preview"
                        className="w-full h-48 object-contain cursor-pointer hover:opacity-80 transition"
                        onClick={() => setFullImageView(cvPreview)}
                      />
                    )}
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {cvFileType === 'application/pdf' ? 'PDF uploaded' : 'Click to view full image'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Other necessary information:
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Recommendation Letters
                  </h3>
                  <label className="flex items-center justify-center bg-green-400 hover:bg-green-500 text-white rounded-lg px-4 py-3 cursor-pointer transition font-semibold">
                    <span className="mr-2">Add file</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleRecommendationUpload}
                      className="hidden"
                    />
                  </label>

                  {recommendationLetters.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {recommendationLetters.map((file, index) => (
                        <div key={index} className="bg-gray-100 rounded p-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700 truncate flex-1">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile("recommendation", index)}
                              className="text-red-500 hover:text-red-700 font-bold ml-2"
                            >
                              ✕
                            </button>
                          </div>
                          {recommendationTypes[index] === 'application/pdf' ? (
                            <div className="flex items-center justify-center h-24 bg-gray-200 rounded">
                              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                              </svg>
                            </div>
                          ) : (
                            <img
                              src={recommendationPreviews[index]}
                              alt={`Recommendation ${index + 1}`}
                              className="w-full h-32 object-contain cursor-pointer hover:opacity-80 transition"
                              onClick={() => setFullImageView(recommendationPreviews[index])}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Career Summary
                  </h3>
                  <label className="flex items-center justify-center bg-green-400 hover:bg-green-500 text-white rounded-lg px-4 py-3 cursor-pointer transition font-semibold">
                    <span className="mr-2">Add file</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      onChange={handleCareerSummaryUpload}
                      className="hidden"
                    />
                  </label>

                  {careerSummary.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {careerSummary.map((file, index) => (
                        <div key={index} className="bg-gray-100 rounded p-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700 truncate flex-1">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removeFile("summary", index)}
                              className="text-red-500 hover:text-red-700 font-bold ml-2"
                            >
                              ✕
                            </button>
                          </div>
                          {careerSummaryTypes[index] === 'application/pdf' ? (
                            <div className="flex items-center justify-center h-24 bg-gray-200 rounded">
                              <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                              </svg>
                            </div>
                          ) : (
                            <img
                              src={careerSummaryPreviews[index]}
                              alt={`Career Summary ${index + 1}`}
                              className="w-full h-32 object-contain cursor-pointer hover:opacity-80 transition"
                              onClick={() => setFullImageView(careerSummaryPreviews[index])}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${
                  loading
                    ? "bg-yellow-400 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-gray-900 font-bold px-12 py-3 rounded-lg text-lg transition`}
              >
                {loading ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplyJobPage;
