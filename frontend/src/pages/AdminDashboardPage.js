import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaUser, FaBuilding, FaBriefcase } from "react-icons/fa";
import { API_BASE_URL } from "../config";

/**
 * AdminDashboardPage
 *
 * - Default shows the "Welcome to Admin Dashboard" (same layout as company dashboard).
 * - Clicking "Admin Panel" in the sidebar shows the full admin management UI (users/companies/jobs/pending).
 * - Sidebar highlights the active area (Dashboard / Admin Panel).
 *
 * NOTE: keep login redirect to "/admin-dashboard" so admin lands here (dashboard view).
 */
const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const token = localStorage.getItem("token");

  // activeTab: "dashboard" | "panel"
  // when "panel" is active we show the full admin panel UI (the long table UI)
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data used by admin panel
  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [pending, setPending] = useState([]);
  const [loadingPanelData, setLoadingPanelData] = useState(false);

  // Ensure only admins can access; if no token, send to login
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // When page mounts we stay on Dashboard view (welcome).
    // Only fetch panel data when user opens Admin Panel to reduce load.
  }, [token, navigate]);

  // Fetch panel data when the admin panel is opened
  useEffect(() => {
    if (activeTab !== "panel") return;

    const fetchPanelData = async () => {
      setLoadingPanelData(true);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, companiesRes, jobsRes, pendingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users`, { headers }),
          fetch(`${API_BASE_URL}/admin/companies`, { headers }),
          fetch(`${API_BASE_URL}/admin/jobs`, { headers }),
          fetch(`${API_BASE_URL}/admin/pending`, { headers }),
        ]);

        // defensively parse responses
        const usersJson = usersRes.ok ? await usersRes.json() : [];
        const companiesJson = companiesRes.ok ? await companiesRes.json() : [];
        const jobsJson = jobsRes.ok ? await jobsRes.json() : [];
        const pendingJson = pendingRes.ok ? await pendingRes.json() : { pendingCompanies: [], pendingUsers: [] };

        setUsers(Array.isArray(usersJson) ? usersJson : []);
        setCompanies(Array.isArray(companiesJson) ? companiesJson : []);
        setJobPosts(Array.isArray(jobsJson) ? jobsJson : []);
        setPending([...(pendingJson.pendingCompanies || []), ...(pendingJson.pendingUsers || [])]);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
        setUsers([]);
        setCompanies([]);
        setJobPosts([]);
        setPending([]);
      } finally {
        setLoadingPanelData(false);
      }
    };

    fetchPanelData();
  }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const handleApproveReject = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/pending/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok) {
        setPending((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert(data.message || "Action failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleDelete = async (type, id) => {
    // map the plural type used in frontend to endpoint in backend
    let endpoint = type;
    if (type === "users") endpoint = "user";
    if (type === "companies") endpoint = "company";
    if (type === "jobs") endpoint = "job";

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/${endpoint}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (type === "users") setUsers((prev) => prev.filter((u) => u._id !== id));
        if (type === "companies") setCompanies((prev) => prev.filter((c) => c._id !== id));
        if (type === "jobs") setJobPosts((prev) => prev.filter((j) => j._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // small helper to mark sidebar item active class
  const sidebarButtonClass = (tabName) =>
    `text-left px-4 py-2 rounded-md mb-1 w-full text-sm ${
      activeTab === tabName ? "bg-indigo-600 text-white font-semibold" : "text-gray-300 hover:bg-slate-800"
    }`;

  // --- Admin Panel UI (exactly the interface you gave; only shown when activeTab === "panel") ---
  const AdminPanelUI = () => {
    const [panelTab, setPanelTab] = useState("users"); // inner tabs inside panel: users/companies/jobs/pending
    const [panelLoading, setPanelLoading] = useState(false);

    // When AdminPanelUI mounts, we already fetched data in parent. We keep local panelTab for tables.
    useEffect(() => {
      // nothing extra — parent already holds users/companies/jobPosts/pending
    }, []);

    const columnsFor = (t) => {
      if (t === "users") return ["Avatar", "Name", "Email", "Role", "Action"];
      if (t === "companies") return ["Company Name", "Email", "Action"];
      if (t === "jobs") return ["Job Title", "Company", "Action"];
      if (t === "pending") return ["Title", "Type", "Action"];
      return [];
    };

    const activeData = panelTab === "users" ? users
      : panelTab === "companies" ? companies
      : panelTab === "jobs" ? jobPosts
      : pending;

    return (
      <>
        <div className="bg-white shadow-lg rounded-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Admin Panel</h2>
              <p className="text-sm text-gray-600">Manage users, companies and job posts.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPanelTab("users")} className={`px-3 py-1 rounded ${panelTab === "users" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>Users</button>
              <button onClick={() => setPanelTab("companies")} className={`px-3 py-1 rounded ${panelTab === "companies" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>Companies</button>
              <button onClick={() => setPanelTab("jobs")} className={`px-3 py-1 rounded ${panelTab === "jobs" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>Jobs</button>
              <button onClick={() => setPanelTab("pending")} className={`px-3 py-1 rounded ${panelTab === "pending" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>Pending</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-md shadow">
          {/* stats row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl"><FaUser /></div>
              <div>
                <h3 className="text-sm font-semibold">Users</h3>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl"><FaBuilding /></div>
              <div>
                <h3 className="text-sm font-semibold">Companies</h3>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>

            <div className="p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl"><FaBriefcase /></div>
              <div>
                <h3 className="text-sm font-semibold">Job Posts</h3>
                <p className="text-2xl font-bold">{jobPosts.length}</p>
              </div>
            </div>
          </div>

          {/* table */}
          <div>
            {loadingPanelData ? (
              <p>Loading panel data...</p>
            ) : (
              <table className="w-full text-sm border-collapse border border-gray-300">
                <thead>
                  <tr className="border-b bg-gray-50">
                    {columnsFor(panelTab).map((col) => (
                      <th key={col} className="py-2 px-3 text-left border-b border-gray-200">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(activeData || []).map((item) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      {panelTab === "users" && (
                        <>
                          <td className="py-2 px-3">
                            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                              {item.name?.[0] || "U"}
                            </div>
                          </td>
                          <td className="py-2 px-3">{item.name}</td>
                          <td className="py-2 px-3">{item.email}</td>
                          <td className="py-2 px-3">{item.role}</td>
                          <td className="py-2 px-3">
                            <button onClick={() => handleDelete("users", item._id)} className="text-red-600 px-2"><FaTrash /></button>
                          </td>
                        </>
                      )}

                      {panelTab === "companies" && (
                        <>
                          <td className="py-2 px-3">{item.companyName || item.name}</td>
                          <td className="py-2 px-3">{item.email}</td>
                          <td className="py-2 px-3">
                            <button onClick={() => handleDelete("companies", item._id)} className="text-red-600 px-2"><FaTrash /></button>
                          </td>
                        </>
                      )}

                      {panelTab === "jobs" && (
                        <>
                          <td className="py-2 px-3">{item.title}</td>
                          <td className="py-2 px-3">{item.companyName}</td>
                          <td className="py-2 px-3">
                            <button onClick={() => handleDelete("jobs", item._id)} className="text-red-600 px-2"><FaTrash /></button>
                          </td>
                        </>
                      )}

                      {panelTab === "pending" && (
                        <>
                          <td className="py-2 px-3">{item.title || item.name}</td>
                          <td className="py-2 px-3">{item.type}</td>
                          <td className="py-2 px-3 flex gap-2">
                            <button onClick={() => handleApproveReject(item._id, "approve")} className="text-green-600 px-2">Approve</button>
                            <button onClick={() => handleApproveReject(item._1d, "reject")} className="text-red-600 px-2">Reject</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </>
    );
  };

  // --- end AdminPanelUI ---

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Top bar */}
      <header className="w-full flex items-center justify-between px-8 py-3 bg-slate-900 relative">
        <h1 className="text-2xl font-semibold">CareerConnect Admin</h1>

        <div className="flex items-center gap-4 relative">
          <div className="flex items-center bg-white rounded-full px-3 py-1 text-gray-700">
            🔍
            <input
              type="text"
              placeholder="Search"
              className="ml-2 bg-transparent outline-none text-sm text-gray-700"
            />
          </div>

          <button className="text-2xl font-bold" onClick={() => setMenuOpen((prev) => !prev)}>☰</button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-md shadow-lg py-2 w-44 z-10">
              <button
                onClick={() => { setMenuOpen(false); navigate("/change-password"); }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >Change Password</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Left sidebar */}
        <aside className="w-56 bg-slate-900 pt-6 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl text-white">
              {profile?.name?.[0] || "A"}
            </div>
            <span className="text-xs text-gray-300 mt-2">{profile?.name || "Admin"}</span>
          </div>

          <nav className="flex flex-col w-full text-sm px-3">
            <button onClick={() => setActiveTab("dashboard")} className={sidebarButtonClass("dashboard")}>
              Dashboard
            </button>

            <button onClick={() => setActiveTab("panel")} className={sidebarButtonClass("panel")}>
              Admin Panel
            </button>

            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">User Management</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">Reports</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">Settings</button>
          </nav>
        </aside>

        {/* Main area */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-6 text-gray-800">
          {/* If user is on dashboard tab show welcome box */}
          {activeTab === "dashboard" && (
            <div className="w-full mt-6 px-6">
              <div className="bg-white shadow-lg rounded-md p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Welcome to Admin Dashboard</h2>
                  <p className="text-sm text-gray-600">Monitor platform activity and manage users & companies.</p>
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow">
                  Quick Action
                </button>
              </div>
            </div>
          )}

          {/* If user clicked Admin Panel tab, render admin panel UI */}
          {activeTab === "panel" && <AdminPanelUI />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
