import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { API_BASE_URL } from "../config";
import { FaTrash, FaUser, FaBuilding, FaBriefcase } from "react-icons/fa";

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const profile = JSON.parse(localStorage.getItem("profile") || "{}");

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [pending, setPending] = useState([]);

  const [loading, setLoading] = useState(true);
  const [panelTab, setPanelTab] = useState("users");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
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

        const pendingJson = await pendingRes.json();
        setPending([
          ...(pendingJson.pendingCompanies || []),
          ...(pendingJson.pendingUsers || []),
        ]);
      } catch (err) {
        console.error("Admin panel fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;

    const map = { users: "user", companies: "company", jobs: "job" };

    try {
      const res = await fetch(`${API_BASE_URL}/admin/${map[type]}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (type === "users") setUsers((p) => p.filter((u) => u._id !== id));
        if (type === "companies") setCompanies((p) => p.filter((c) => c._id !== id));
        if (type === "jobs") setJobPosts((p) => p.filter((j) => j._id !== id));
      }
    } catch {}
  };

  return (
    <AdminLayout profile={profile}>
      {/* panel top section */}
      <div className="bg-white shadow-lg rounded-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Admin Panel</h2>
            <p className="text-sm text-gray-600">Manage users, companies and job posts.</p>
          </div>

          <div className="flex gap-2">
            {["users", "companies", "jobs", "pending"].map((tab) => (
              <button
                key={tab}
                onClick={() => setPanelTab(tab)}
                className={`px-3 py-1 rounded ${
                  panelTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="bg-white p-6 rounded-md shadow">
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="p-4 rounded-md shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl">
              <FaUser />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-md shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
              <FaBuilding />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Companies</h3>
              <p className="text-2xl font-bold">{companies.length}</p>
            </div>
          </div>

          <div className="p-4 rounded-md shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl">
              <FaBriefcase />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Job Posts</h3>
              <p className="text-2xl font-bold">{jobPosts.length}</p>
            </div>
          </div>
        </div>

        {/* table */}
        {!loading && (
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="border-b bg-gray-50">
                {panelTab === "users" &&
                  ["Avatar", "Name", "Email", "Role", "Action"].map((col) => (
                    <th key={col} className="py-2 px-3 text-left border-b border-gray-200">
                      {col}
                    </th>
                  ))}

                {panelTab === "companies" &&
                  ["Company Name", "Email", "Action"].map((col) => (
                    <th key={col} className="py-2 px-3 text-left">{col}</th>
                  ))}

                {panelTab === "jobs" &&
                  ["Job Title", "Company", "Action"].map((col) => (
                    <th key={col} className="py-2 px-3 text-left">{col}</th>
                  ))}

                {panelTab === "pending" &&
                  ["Title", "Type", "Action"].map((col) => (
                    <th key={col} className="py-2 px-3 text-left">{col}</th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {panelTab === "users" &&
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-100">
                    <td className="py-2 px-3">
                      <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                        {u.name[0]}
                      </div>
                    </td>
                    <td className="py-2 px-3">{u.name}</td>
                    <td className="py-2 px-3">{u.email}</td>
                    <td className="py-2 px-3">{u.role}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDelete("users", u._id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

              {panelTab === "companies" &&
                companies.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-100">
                    <td className="py-2 px-3">{c.companyName || c.name || "N/A"}</td>
                    <td className="py-2 px-3">{c.email}</td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDelete("companies", c._id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPanelPage;
