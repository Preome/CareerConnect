import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const usersRes = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        setUsers(usersData);

        const companiesRes = await fetch(`${API_BASE_URL}/admin/companies`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const companiesData = await companiesRes.json();
        setCompanies(companiesData);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete user");
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/company/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Delete failed");

      setCompanies(companies.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete company");
    }
  };

  return (
    <div className="min-h-screen bg-sky-100">
      <header className="w-full bg-blue-900 text-white flex items-center px-10 py-4 shadow-md">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </header>

      <main className="p-8">
        {message && <p className="text-red-600 mb-4">{message}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <table className="w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="p-2 border">{user.name || "-"}</td>
                      <td className="p-2 border">{user.email}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Companies</h2>
              <table className="w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Company Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company._id}>
                      <td className="p-2 border">{company.name || "-"}</td>
                      <td className="p-2 border">{company.email}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteCompany(company._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
