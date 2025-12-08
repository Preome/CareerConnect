import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const storedProfile = localStorage.getItem("profile");
  const initialProfile = storedProfile ? JSON.parse(storedProfile) : null;

  // State for profile data
  const [profile, setProfile] = useState(initialProfile);
  
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  
  // State for menu dropdown
  const [menuOpen, setMenuOpen] = useState(false);

  // State for image viewer modal
  const [imageViewer, setImageViewer] = useState({
    isOpen: false,
    imageUrl: null,
    title: ""
  });

  // State for delete account modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    password: "",
    loading: false
  });

  // State for form data (edit mode)
  const [formData, setFormData] = useState({
    currentAddress: "",
    academicBackground: "",
    cgpa: "",
    skills: "",
    projectLink: "",
    linkedinLink: "",
    studentType: "",
    department: ""
  });

  // State for file uploads
  const [files, setFiles] = useState({
    profilePhoto: null,
    certificate: null,
    cv: null
  });

  // State for file previews
  const [filePreviews, setFilePreviews] = useState({
    profilePhoto: null,
    certificate: null,
    cv: null
  });

  // Load profile data into form when entering edit mode
  useEffect(() => {
    if (profile && isEditing) {
      setFormData({
        currentAddress: profile.currentAddress || "",
        academicBackground: profile.academicBackground || "",
        cgpa: profile.cgpa || "",
        skills: profile.skills || "",
        projectLink: profile.projectLink || "",
        linkedinLink: profile.linkedinLink || "",
        studentType: profile.studentType || "",
        department: profile.department || ""
      });
    }
  }, [isEditing, profile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file only!");
        return;
      }

      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("currentAddress", formData.currentAddress);
      formDataToSend.append("academicBackground", formData.academicBackground);
      formDataToSend.append("cgpa", formData.cgpa);
      formDataToSend.append("skills", formData.skills);
      formDataToSend.append("projectLink", formData.projectLink);
      formDataToSend.append("linkedinLink", formData.linkedinLink);
      formDataToSend.append("studentType", formData.studentType);
      formDataToSend.append("department", formData.department);

      // Append files if selected
      if (files.profilePhoto) {
        formDataToSend.append("profilePhoto", files.profilePhoto);
      }
      if (files.certificate) {
        formDataToSend.append("certificate", files.certificate);
      }
      if (files.cv) {
        formDataToSend.append("cv", files.cv);
      }

      // Send to backend using API_BASE_URL from config
      const response = await axios.put(
        `${API_BASE_URL}/auth/update-profile`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // Update localStorage with new profile data
      const updatedProfile = response.data.profile;
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      // Exit edit mode
      setIsEditing(false);

      // Reset file states
      setFiles({
        profilePhoto: null,
        certificate: null,
        cv: null
      });
      setFilePreviews({
        profilePhoto: null,
        certificate: null,
        cv: null
      });

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form and file states
    setFiles({
      profilePhoto: null,
      certificate: null,
      cv: null
    });
    setFilePreviews({
      profilePhoto: null,
      certificate: null,
      cv: null
    });
  };

  const handleDeleteAccount = async () => {
    if (!deleteModal.password) {
      alert("Please enter your password");
      return;
    }

    setDeleteModal(prev => ({ ...prev, loading: true }));

    try {
      const token = localStorage.getItem("token");
      
      await axios.delete(`${API_BASE_URL}/auth/delete-account`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          password: deleteModal.password
        }
      });

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("profile");

      alert("Account deleted successfully");
      
      // Redirect to home page
      navigate("/");

    } catch (error) {
      console.error("Error deleting account:", error);
      alert(error.response?.data?.message || "Failed to delete account");
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const openImageViewer = (imageUrl, title) => {
    setImageViewer({
      isOpen: true,
      imageUrl,
      title
    });
  };

  const closeImageViewer = () => {
    setImageViewer({
      isOpen: false,
      imageUrl: null,
      title: ""
    });
  };

  const avatarUrl = profile?.imageUrl || null;

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

      {/* MAIN FLEX AREA */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-52 bg-slate-900 text-white pt-6">
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
            <button className="text-left px-4 py-2 hover:bg-slate-800">
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
            <button className="text-left px-4 py-2 bg-indigo-600">
              Profile
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-gradient-to-b from-gray-100 to-gray-300 p-6 overflow-auto">
          {profile && (
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-auto p-8">
              {/* Header with Edit/Save/Cancel buttons */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {isEditing ? "Edit Student Profile" : "Student Profile"}
                </h2>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition font-semibold"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold"
                    >
                      Save Profile
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {filePreviews.profilePhoto ? (
                    <img
                      src={filePreviews.profilePhoto}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 cursor-pointer"
                      onClick={() => !isEditing && openImageViewer(filePreviews.profilePhoto, "Profile Photo")}
                    />
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 cursor-pointer hover:opacity-90 transition"
                      onClick={() => !isEditing && openImageViewer(avatarUrl, "Profile Photo")}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-4xl text-gray-500">📷</span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-700 transition font-semibold">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "profilePhoto")}
                    />
                  </label>
                )}
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="text"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={profile.mobile}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Gender</label>
                  <input
                    type="text"
                    value={profile.gender}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-100"
                  />
                </div>
              </div>

              {/* Student Type - EDITABLE */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Student Type</label>
                {isEditing ? (
                  <select
                    name="studentType"
                    value={formData.studentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={profile.studentType || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                )}
              </div>

              {/* Current Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Current Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your current address"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.currentAddress || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                )}
              </div>

              {/* Academic Information Section */}
              <h3 className="text-lg font-bold mb-4 mt-8">Academic Information</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1">Academic Background</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="academicBackground"
                      value={formData.academicBackground}
                      onChange={handleInputChange}
                      placeholder="e.g., BSc in Computer Science"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile.academicBackground || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">CGPA</label>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                      placeholder="e.g., 3.75"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile.cgpa || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Department/Program</label>
                  {isEditing ? (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">Select department</option>
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Law">Law</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="BBA">BBA</option>
                      <option value="Economics">Economics</option>
                      <option value="MNS">MNS</option>
                      <option value="English & Humanities">English & Humanities</option>
                      <option value="General Education">General Education</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={profile.department}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-1">Skills</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., React, Node.js, MongoDB, Python"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.skills || ""}
                    disabled
                    className="w-full px-3 py-2 border rounded-md bg-gray-50"
                  />
                )}
              </div>

              {/* File Uploads Section */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Certificate Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Certificate</label>
                  {isEditing ? (
                    <>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-purple-400 border-dashed rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100">
                        <span className="text-4xl mb-2">📄</span>
                        <span className="text-sm text-purple-600 font-semibold">Upload file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "certificate")}
                        />
                      </label>
                      {(filePreviews.certificate || profile.certificateUrl) && (
                        <img
                          src={filePreviews.certificate || profile.certificateUrl}
                          alt="Certificate"
                          className="mt-2 w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                    </>
                  ) : profile.certificateUrl ? (
                    <img
                      src={profile.certificateUrl}
                      alt="Certificate"
                      className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                      onClick={() => openImageViewer(profile.certificateUrl, "Certificate")}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 rounded-lg bg-gray-50">
                      <span className="text-gray-400">No certificate uploaded</span>
                    </div>
                  )}
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Curriculum Vitae</label>
                  {isEditing ? (
                    <>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-400 border-dashed rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100">
                        <span className="text-4xl mb-2">📄</span>
                        <span className="text-sm text-yellow-600 font-semibold">Upload file</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, "cv")}
                        />
                      </label>
                      {(filePreviews.cv || profile.cvUrl) && (
                        <img
                          src={filePreviews.cv || profile.cvUrl}
                          alt="CV"
                          className="mt-2 w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                    </>
                  ) : profile.cvUrl ? (
                    <img
                      src={profile.cvUrl}
                      alt="CV"
                      className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                      onClick={() => openImageViewer(profile.cvUrl, "Curriculum Vitae")}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-32 border-2 border-gray-300 rounded-lg bg-gray-50">
                      <span className="text-gray-400">No CV uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Links Section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <span>🔗</span> Project Link
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="projectLink"
                      value={formData.projectLink}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername/project"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile.projectLink || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
                    <span>🔗</span> LinkedIn Link
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <input
                      type="text"
                      value={profile.linkedinLink || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50"
                    />
                  )}
                </div>
              </div>

              {/* Delete Account Button (Only in Edit Mode) */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, password: "", loading: false })}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition font-semibold"
                  >
                    Delete Your Account
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Image Viewer Modal */}
      {imageViewer.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImageViewer}>
          <div className="relative bg-white rounded-lg p-4 max-w-3xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeImageViewer}
              className="absolute top-2 right-2 bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 transition font-bold text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">{imageViewer.title}</h3>
            <img
              src={imageViewer.imageUrl}
              alt={imageViewer.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-red-600">Delete Account</h3>
            <p className="text-gray-700 mb-4">
              This action cannot be undone. Please enter your password to confirm account deletion.
            </p>
            <input
              type="password"
              placeholder="Enter your password"
              value={deleteModal.password}
              onChange={(e) => setDeleteModal(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md mb-4"
              disabled={deleteModal.loading}
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteModal.loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {deleteModal.loading ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: false, password: "", loading: false })}
                disabled={deleteModal.loading}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
