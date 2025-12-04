import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaUser, FaBuilding, FaBriefcase } from "react-icons/fa";
import { API_BASE_URL } from "../config";

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");
  const profile = storedProfile ? JSON.parse(storedProfile) : null;
  const token = localStorage.getItem("token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, companiesRes, jobsRes, pendingRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/users`, { headers }),
          fetch(`${API_BASE_URL}/admin/companies`, { headers }),
          fetch(`${API_BASE_URL}/admin/jobs`, { headers }),
          fetch(`${API_BASE_URL}/admin/pending`, { headers }),
        ]);

        setUsers(await usersRes.json());
        setCompanies(await companiesRes.json());
        setJobPosts(await jobsRes.json());
        const pendingData = await pendingRes.json();
        setPending([
          ...pendingData.pendingCompanies,
          ...pendingData.pendingUsers
        ]);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

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
    let endpoint = type;
    if (type === "users") endpoint = "user";
    if (type === "companies") endpoint = "company";
    if (type === "jobs") endpoint = "job";

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

  if (loading) return <p className="p-6 text-white">Loading...</p>;

  let activeData = [];
  let columns = [];
  if (activeTab === "users") {
    activeData = users;
    columns = ["Avatar", "Name", "Email", "Role", "Action"];
  } else if (activeTab === "companies") {
    activeData = companies;
    columns = ["Company Name", "Email", "Action"];
  } else if (activeTab === "jobs") {
    activeData = jobPosts;
    columns = ["Job Title", "Company", "Action"];
  } else if (activeTab === "pending") {
    activeData = pending;
    columns = ["Title", "Type", "Action"];
  }

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
        {/* Sidebar */}
        <aside className="w-56 bg-slate-900 pt-6 flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl text-white">
              {profile?.name?.[0] || "A"}
            </div>
            <span className="text-xs text-gray-300 mt-2">{profile?.name || "Admin"}</span>
          </div>

          <nav className="flex flex-col w-full text-sm">
            <button className="text-left px-4 py-2 bg-indigo-600 w-full">Dashboard</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">Admin Panel</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">User Management</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">Reports</button>
            <button className="text-left px-4 py-2 hover:bg-slate-800 w-full">Settings</button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-6 text-gray-800">
          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl"><FaUser /></div>
              <div>
                <h3 className="text-sm font-semibold">Users</h3>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl"><FaBuilding /></div>
              <div>
                <h3 className="text-sm font-semibold">Companies</h3>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl"><FaBriefcase /></div>
              <div>
                <h3 className="text-sm font-semibold">Job Posts</h3>
                <p className="text-2xl font-bold">{jobPosts.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-4">
            {["users", "companies", "jobs", "pending"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-md font-semibold ${
                  activeTab === tab ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-md shadow">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="border-b border-gray-300">
                  {columns.map((col) => <th key={col} className="py-2 text-left border-b border-gray-300">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {activeData.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-100">
                    {activeTab === "users" && <>
                      <td>
                        <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                          {item.name?.[0] || "U"}
                        </div>
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>
                        <button onClick={() => handleDelete("users", item._id)} className="text-red-600 px-2">
                          <FaTrash />
                        </button>
                      </td>
                    </>}
                    {activeTab === "companies" && <>
                      <td>{item.companyName || item.name}</td>
                      <td>{item.email}</td>
                      <td>
                        <button onClick={() => handleDelete("companies", item._id)} className="text-red-600 px-2">
                          <FaTrash />
                        </button>
                      </td>
                    </>}
                    {activeTab === "jobs" && <>
                      <td>{item.title}</td>
                      <td>{item.companyName}</td>
                      <td>
                        <button onClick={() => handleDelete("jobs", item._id)} className="text-red-600 px-2">
                          <FaTrash />
                        </button>
                      </td>
                    </>}
                    {activeTab === "pending" && <>
                      <td>{item.title || item.name}</td>
                      <td>{item.type}</td>
                      <td className="flex gap-2">
                        <button onClick={() => handleApproveReject(item._id, "approve")} className="text-green-600 px-2">Approve</button>
                        <button onClick={() => handleApproveReject(item._id, "reject")} className="text-red-600 px-2">Reject</button>
                      </td>
                    </>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanelPage;