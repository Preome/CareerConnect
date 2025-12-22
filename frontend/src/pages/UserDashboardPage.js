// src/pages/UserDashboardPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;

  const avatarUrl = profile?.imageUrl || null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [studentCategoryFilter, setStudentCategoryFilter] = useState("All");

  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showDepartmentMenu, setShowDepartmentMenu] = useState(false);
  const [showStudentCategoryMenu, setShowStudentCategoryMenu] =
    useState(false);

  // track which jobs are followed by this user
  const [followedJobIds, setFollowedJobIds] = useState(new Set());

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const departmentOptions = [
    "All",
    "Any",
    "CSE",
    "EEE",
    "Architecture",
    "Pharmacy",
    "Economics",
    "Law",
    "BBA",
    "English and Humanities",
    "General education",
  ];

  const studentCategoryOptions = ["All", "Undergraduate", "Graduate"];

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (departmentFilter !== "All")
        params.append("department", departmentFilter);
      if (studentCategoryFilter !== "All")
        params.append("studentCategory", studentCategoryFilter);

      const url = `http://localhost:5000/api/jobs${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await axios.get(url);
      setJobs(res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // fetch jobs the user is already following
  const fetchFollowedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/jobs/user/followed",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ids = new Set((res.data || []).map((job) => job._id));
      setFollowedJobIds(ids);
    } catch (err) {
      console.error(
        "Error fetching followed jobs:",
        err.response?.data || err.message
      );
    }
  };

  // follow a job
  const handleFollow = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to follow jobs");
        return;
      }

      await axios.post(
        `http://localhost:5000/api/jobs/${jobId}/follow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFollowedJobIds((prev) => new Set(prev).add(jobId));
    } catch (err) {
      console.error("Error following job:", err.response?.data || err.message);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to follow job"
      );
    }
  };

  // unfollow a job
  const handleUnfollow = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to manage followed jobs");
        return;
      }

      await axios.delete(`http://localhost:5000/api/jobs/${jobId}/follow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFollowedJobIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    } catch (err) {
      console.error(
        "Error unfollowing job:",
        err.response?.data || err.message
      );
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to unfollow job"
      );
    }
  };

  useEffect(() => {
    const run = async () => {
      await fetchJobs();
      await fetchFollowedJobs();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, departmentFilter, studentCategoryFilter]);

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
        {/* Left sidebar – sticky */}
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
            <button className="text-left px-4 py-2 bg-indigo-600">Home</button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/applied-jobs")}
            >
              Applied Jobs
            </button>
            <button
              className="text-left px-4 py-2 hover:bg-slate-800"
              onClick={() => navigate("/followed-jobs")}
            >
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

        {/* Main area: job feed */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 py-8 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Filter buttons + menus */}
            <div className="flex flex-wrap gap-4 mb-4 relative">
              {/* Category filter */}
              <div className="relative">
                <button
                  className="bg-indigo-500 text-white px-6 py-2 rounded-md text-sm font-semibold shadow flex items-center gap-2"
                  type="button"
                  onClick={() => {
                    setShowCategoryMenu((p) => !p);
                    setShowDepartmentMenu(false);
                    setShowStudentCategoryMenu(false);
                  }}
                >
                  Filter by Job Category
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {categoryFilter}
                  </span>
                </button>

                {showCategoryMenu && (
                  <div className="absolute z-20 mt-1 w-40 bg-white rounded-md shadow border text-sm text-gray-700">
                    {["All", "Part-time", "Full-time"].map((cat) => (
                      <button
                        key={cat}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setShowCategoryMenu(false);
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Department filter */}
              <div className="relative">
                <button
                  className="bg-indigo-500 text-white px-6 py-2 rounded-md text-sm font-semibold shadow flex items-center gap-2"
                  type="button"
                  onClick={() => {
                    setShowDepartmentMenu((p) => !p);
                    setShowCategoryMenu(false);
                    setShowStudentCategoryMenu(false);
                  }}
                >
                  Filter by Department
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                    {departmentFilter}
                  </span>
                </button>

                {showDepartmentMenu && (
                  <div className="absolute z-20 mt-1 w-56 bg-white rounded-md shadow border text-sm text-gray-700 max-h-64 overflow-y-auto">
                    {departmentOptions.map((dep) => (
                      <button
                        key={dep}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        onClick={() => {
                          setDepartmentFilter(dep);
                          setShowDepartmentMenu(false);
                        }}
                      >
                        {dep}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Student Category filter */}
              <div className="relative">
                <button
                  className="bg-indigo-500 text-white px-6 py-2 rounded-md text-sm font-semibold shadow flex items-center gap-2"
                  type="button"
                  onClick={() => {
                    setShowStudentCategoryMenu((p) => !p);
                    setShowCategoryMenu(false);
                    setShowDepartmentMenu(false);
                  }}
                >
                  Filter by Student Category
                  <span className="text-xs bg:white/20 px-2 py-0.5 rounded">
                    {studentCategoryFilter}
                  </span>
                </button>

                {showStudentCategoryMenu && (
                  <div className="absolute z-20 mt-1 w-56 bg-white rounded-md shadow border text-sm text-gray-700 max-h-64 overflow-y-auto">
                    {studentCategoryOptions.map((opt) => (
                      <button
                        key={opt}
                        className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
                        onClick={() => {
                          setStudentCategoryFilter(opt);
                          setShowStudentCategoryMenu(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-600">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-gray-600">No jobs available.</p>
            ) : (
              <div className="space-y-6">
                {jobs.map((job) => {
                  const companyName =
                    job.company?.companyName ||
                    job.company?.name ||
                    "Company";
                  const companyLogo = job.company?.imageUrl || null;
                  const logoFallback =
                    companyName && typeof companyName === "string"
                      ? companyName[0].toUpperCase()
                      : "C";

                  const isFollowing = followedJobIds.has(job._id);

                  return (
                    <div
                      key={job._id}
                      className="bg-white rounded-xl shadow-md p-4 md:p-5"
                    >
                      {/* company header */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                          <div className="bg-[#10215a] text-white rounded-md shadow-md flex items-center h-14 md:h-16 px-5">
                            <div className="w-10 h-10 mr-3 rounded-md overflow-hidden bg-[#00a9e7] flex items-center justify-center">
                              {companyLogo ? (
                                <img
                                  src={companyLogo}
                                  alt={companyName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <span className="text-xl font-bold">
                                  {logoFallback}
                                </span>
                              )}
                            </div>
                            <p className="text-base md:text-lg font-semibold tracking-wide whitespace-nowrap">
                              {companyName}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() =>
                              navigate(`/apply-job/${job._id}`, {
                                state: {
                                  companyName: companyName,
                                  companyId: job.company?._id,
                                  jobTitle: job.title,
                                },
                              })
                            }
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow"
                          >
                            Apply
                          </button>
                          {isFollowing ? (
                            <button
                              onClick={() => handleUnfollow(job._id)}
                              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow"
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFollow(job._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      </div>

                      {/* job meta + details */}
                      <div className="text-xs md:text-sm text-slate-900 leading-relaxed">
                        <div className="space-x-4">
                          <span>
                            <span className="font-semibold text-pink-700">
                              Job Title:
                            </span>{" "}
                            {job.title}
                          </span>
                          <span>
                            <span className="font-semibold text-pink-700">
                              Job Category:
                            </span>{" "}
                            {job.category}
                          </span>
                          <span>
                            <span className="font-semibold text-pink-700">
                              Department:
                            </span>{" "}
                            {job.department}
                          </span>
                        </div>

                        <div className="space-x-4 mt-1">
                          <span>
                            <span className="font-semibold text-pink-700">
                              Student Category:
                            </span>{" "}
                            {job.studentCategory}
                          </span>
                          <span>
                            <span className="font-semibold text-pink-700">
                              Gender:
                            </span>{" "}
                            {job.gender}
                          </span>
                          <span>
                            <span className="font-semibold text-pink-700">
                              Deadline:
                            </span>{" "}
                            {job.deadline
                              ? new Date(job.deadline).toLocaleDateString()
                              : ""}
                          </span>
                        </div>

                        <p className="mt-1">
                          <span className="font-semibold text-pink-700">
                            Address:
                          </span>{" "}
                          {job.address}
                        </p>

                        <p className="mt-3 font-semibold text-pink-700">
                          Job Description
                        </p>
                        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-sm text-gray-700 whitespace-pre-line">
                          {job.description}
                        </div>

                        <p className="mt-3 font-semibold text-pink-700">
                          Job Requirements
                        </p>
                        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-sm text-gray-700 whitespace-pre-line">
                          {job.requirements}
                        </div>

                        <p className="mt-3 font-semibold text-pink-700">
                          Job Benefits
                        </p>
                        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-sm text-gray-700 whitespace-pre-line">
                          {job.benefits}
                        </div>

                        <p className="mt-3 font-semibold text-pink-700">
                          Job Experience
                        </p>
                        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-sm text-gray-700 whitespace-pre-line">
                          {job.experience}
                        </div>

                        <p className="mt-3 font-semibold text-pink-700">
                          Salary Range
                        </p>
                        <div className="mt-1 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs md:text-sm text-gray-700 whitespace-pre-line">
                          {job.salaryRange}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;
