import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch users and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();

        const companiesRes = await fetch(`${API_BASE_URL}/admin/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companiesData = await companiesRes.json();

        setUsers(usersData);
        setCompanies(companiesData);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="w-full bg-indigo-700 text-white flex justify-between px-8 py-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>

      <main className="flex-1 p-6">
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id}>
                    <td className="border px-2 py-1">{i + 1}</td>
                    <td className="border px-2 py-1">{user.name || "N/A"}</td>
                    <td className="border px-2 py-1">{user.email}</td>
                    <td className="border px-2 py-1">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Companies</h2>
          {companies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Company Name</th>
                  <th className="border px-2 py-1">Email</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr key={c._id}>
                    <td className="border px-2 py-1">{i + 1}</td>
                    <td className="border px-2 py-1">{c.companyName || c.name}</td>
                    <td className="border px-2 py-1">{c.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
