// frontend/src/pages/CompanyProfilePage.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");

  // -----------------------------
  // 💡 AUTO-FIX COMPANY NAME HERE
  // -----------------------------
  const normalizeProfile = (data) => {
    if (!data) return {};

    return {
      id: data.id || data._id || null,
      role: data.role || data.userRole || data.roleType || null,
      email: data.email || data.contactEmail || "",
      companyName: data.companyName || data.name || data.company?.name || "",
      email: data.email || "",
      contactNo: data.contactNo || "",
      establishmentYear: data.establishmentYear || "",
      industryType: data.industryType || "",
      address: data.address || "",
      licenseNo: data.licenseNo || "",
      imageUrl: data.imageUrl || "",
      website: data.website || "",
      companySize: data.companySize || "",
      companyType: data.companyType || "",
      about: data.about || "",
      facebook: data.facebook || "",
      linkedin: data.linkedin || "",
      tagline: data.tagline || "",
      hrName: data.hrName || "",
      hrEmail: data.hrEmail || "",
      hrPhone: data.hrPhone || "",
    };
  };

  const defaultProfile = storedProfile
    ? normalizeProfile(JSON.parse(storedProfile))
    : normalizeProfile({});

  const [profile, setProfile] = useState(defaultProfile);
  const [tempProfile, setTempProfile] = useState(defaultProfile);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRefSidebar = useRef(null);
  const fileInputRefMain = useRef(null);

  const avatarUrl = profile?.imageUrl || null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Not authenticated");

      const stored = JSON.parse(localStorage.getItem("profile") || "{}");
      let companyId = stored.id || stored._id || profile.id;
      if (!companyId) return alert("Company id not found. Please re-login.");

      const res = await fetch(`${API_BASE_URL}/company/${companyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tempProfile),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Save failed", data);
        return alert(data.message || "Failed to save profile");
      }

      const newProfile = {
        id: data._id || data.id || companyId,
        role: "company",
        companyName: data.companyName,
        email: data.email,
        contactNo: data.contactNo,
        establishmentYear: data.establishmentYear,
        industryType: data.industryType,
        address: data.address,
        licenseNo: data.licenseNo,
        imageUrl: data.imageUrl,
        website: data.website,
        companySize: data.companySize,
        companyType: data.companyType,
        about: data.about,
        facebook: data.facebook,
        linkedin: data.linkedin,
        tagline: data.tagline,
        hrName: data.hrName,
        hrEmail: data.hrEmail,
        hrPhone: data.hrPhone,
      };

      setProfile({ ...profile, ...tempProfile });
      setTempProfile({ ...tempProfile });
      localStorage.setItem("profile", JSON.stringify(newProfile));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Server error while saving profile");
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleDelete = () => {
    localStorage.removeItem("profile");
    setProfile(normalizeProfile({}));
    setTempProfile(normalizeProfile({}));
    setIsEditing(false);
  };

  const handleFileSelected = (file) => {
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Please select a PNG/JPG/WebP image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const updated = { ...profile, imageUrl: dataUrl };
      const updatedTemp = { ...tempProfile, imageUrl: dataUrl };
      setProfile(updated);
      setTempProfile(updatedTemp);
      localStorage.setItem("profile", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const triggerSidebarFile = () => fileInputRefSidebar.current?.click();
  const triggerMainFile = () => fileInputRefMain.current?.click();

  const handleDeleteImage = () => {
    const updated = { ...profile, imageUrl: "" };
    const updatedTemp = { ...tempProfile, imageUrl: "" };
    setProfile(updated);
    setTempProfile(updatedTemp);
    localStorage.setItem("profile", JSON.stringify(updated));
  };

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
            className="text-2xl font-bold"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            ☰
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white text-gray-800 rounded-md shadow-lg py-2 w-40">
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
        {/* Sidebar */}
        <aside className="w-56 bg-slate-900 text-white pt-6">
          <div className="flex flex-col items-center mb-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Company" className="w-16 h-16 rounded-md object-cover bg-slate-700" />
            ) : (
              <div className="w-16 h-16 rounded-md bg-slate-700" />
            )}

            <div className="flex gap-2 mt-2">
              <button onClick={triggerSidebarFile} className="bg-white px-2 py-1 rounded shadow-md text-xs">📷</button>
              <button onClick={handleDeleteImage} className="bg-red-600 px-2 py-1 rounded shadow-md text-white text-xs">🗑️</button>
            </div>

            <input
              ref={fileInputRefSidebar}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                handleFileSelected(f);
                e.target.value = null;
              }}
            />

            <span className="text-xs text-gray-300 mt-2">
              {profile.companyName || "Company"}
            </span>
          </div>

          <nav className="flex flex-col text-sm">
            {/* Dashboard */}
            <button 
              className="px-4 py-2 text-left hover:bg-slate-800" 
              onClick={() => navigate("/company-dashboard")}
            >
              Dashboard
            </button>

            {/* Posted Jobs */}
            <button 
              className="px-4 py-2 text-left hover:bg-slate-800"
              onClick={() => navigate("/company/posted-jobs")}
            >
              Posted Jobs
            </button>

            {/* Candidate list */}
            <button 
              className="px-4 py-2 text-left hover:bg-slate-800"
              onClick={() => navigate("/company/candidates")}
            >
              Candidate list
            </button>

            {/* Messages */}
            <button className="px-4 py-2 text-left hover:bg-slate-800">
              Messages
            </button>

            {/* Query Forum */}
            <button className="px-4 py-2 text-left hover:bg-slate-800">
              Query Forum
            </button>

            {/* Posted CareerEvents - BEFORE Profile */}
            <button
              className="px-4 py-2 text-left hover:bg-slate-800"
              onClick={() => navigate("/company/posted-career-events")}
            >
              Posted CareerEvents
            </button>

            {/* Profile - ACTIVE (purple) - LAST */}
            <button className="px-4 py-2 text-left bg-indigo-600">
              Profile
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-6 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-8">
            <h2 className="text-lg font-semibold mb-6">Company Information</h2>

            <div className="flex flex-col items-center mb-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Company" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-700" />
              )}

              <div className="flex gap-2 mt-2">
                <button onClick={triggerMainFile} className="bg-white px-3 py-1 rounded shadow-md text-sm">📷</button>
                <button onClick={handleDeleteImage} className="bg-red-600 px-3 py-1 rounded shadow-md text-white text-sm">🗑️</button>
              </div>

              <input
                ref={fileInputRefMain}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  handleFileSelected(f);
                  e.target.value = null;
                }}
              />
            </div>

            {/* Profile Fields */}
            <div className="border rounded-md overflow-hidden text-sm">
              {[
                ["Company Name", "companyName"],
                ["Email", "email"],
                ["Phone", "contactNo"],
                ["Establishment Year", "establishmentYear"],
                ["Industry", "industryType"],
                ["Address", "address"],
                ["License No", "licenseNo"],
              ].map(([label, key]) => (
                <div key={key} className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">{label}:</span>
                  {!isEditing ? (
                    <span>{profile[key]}</span>
                  ) : (
                    <input
                      name={key}
                      value={tempProfile[key]}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <h3 className="mt-4 mb-2 font-semibold text-gray-700">Additional Information</h3>
            <div className="border rounded-md overflow-hidden text-sm max-h-64 overflow-y-auto">
              {[
                ["Website", "website"],
                ["Company Size", "companySize"],
                ["Company Type", "companyType"],
                ["About Company", "about"],
                ["Facebook Page", "facebook"],
                ["LinkedIn Page", "linkedin"],
                ["Tagline", "tagline"],
                ["HR Name", "hrName"],
                ["HR Email", "hrEmail"],
                ["HR Phone", "hrPhone"],
              ].map(([label, key]) => (
                <div key={key} className="flex border-b px-4 py-2">
                  <span className="w-44 font-medium">{label}:</span>
                  {!isEditing ? (
                    <span>{profile[key]}</span>
                  ) : (
                    <input
                      name={key}
                      value={tempProfile[key]}
                      onChange={handleChange}
                      className="border px-2 py-1 rounded w-full"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              {!isEditing && (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}

              {isEditing && (
                <>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>

                  <button
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
