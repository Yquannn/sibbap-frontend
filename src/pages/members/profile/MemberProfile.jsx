import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, Mail, Settings, LogOut, ArrowLeft } from "lucide-react";
import defaultPicture from "../assets/blankPicture.png";
import { useNavigate } from "react-router-dom";

const MemberProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          throw new Error("User email not found. Please log in again.");
        }
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member/email/${email}`
        );
        setUser(response.data);
        setEditableData(response.data);
      } catch (err) {
        setError(err.message || "Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Scroll listener: Reload the page when scrolling up
  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY < lastScrollY) {
        window.location.reload();
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEdit = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBlurOrEnter = async (field) => {
    try {
      await axios.put(`http://192.168.254.103:3001/api/member/update`, {
        email: user.email,
        [field]: editableData[field],
      });
      setUser((prev) => ({ ...prev, [field]: editableData[field] }));
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("id_picture", selectedImage);
    formData.append("email", user.email);

    try {
      const response = await axios.post(
        "http://192.168.254.103:3001/api/member/uploadPicture",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUser((prev) => ({ ...prev, id_picture: response.data.fileName }));
      alert("Profile picture updated successfully.");
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image.");
    }
  };

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="w-full max-w-sm mx-auto text-center">
      {loading ? (
        // Skeleton loader using full width space
        <div className="flex flex-col gap-4 mx-auto w-full max-w-lg">
          <div className="flex items-center gap-4">
            <div className="skeleton h-20 w-20 shrink-0 rounded-full"></div>
            <div className="flex flex-col gap-2 flex-grow">
              <div className="skeleton h-6 w-3/4"></div>
              <div className="skeleton h-6 w-full"></div>
            </div>
          </div>
          <div className="skeleton h-40 w-full"></div>
        </div>
      ) : (
        <>
          <img
            src={
              imagePreview ||
              (user?.id_picture
                ? `http://192.168.254.103:3001/uploads/${user.id_picture}`
                : defaultPicture)
            }
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border-4 border-green-500 mt-2 cursor-pointer"
            onClick={handleProfileClick}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          {selectedImage && (
            <button
              className="mt-2 bg-cyan-500 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-600"
              onClick={handleImageUpload}
            >
              Upload Image
            </button>
          )}

          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500 text-sm flex items-center justify-center gap-2 mt-1">
            <Mail size={16} /> {user?.email || "No Email Provided"}
          </p>

          {activeTab === null && (
            <div className="mt-6 space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300"
                onClick={() => setActiveTab("account")}
              >
                <User size={18} /> Account Information
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300"
                onClick={() => setActiveTab("settings")}
              >
                <Settings size={18} /> Settings
              </button>
              <button
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-lg shadow hover:bg-red-600"
                onClick={handleLogout}
              >
                <LogOut size={18} /> Log Out
              </button>
            </div>
          )}

          {activeTab !== null && (
            <div className="mt-6 text-left min-h-[550px]">
              {activeTab === "account" && (
                <div>
                  <h3 className="text-lg font-bold mb-2 text-center">
                    Account Information
                  </h3>
                  <div className="mb-2">
                    <strong>First Name:</strong>
                    <input
                      type="text"
                      value={editableData.FirstName || ""}
                      className="border rounded px-2 py-1 w-full"
                      onChange={(e) =>
                        handleEdit("FirstName", e.target.value)
                      }
                      onBlur={() => handleBlurOrEnter("FirstName")}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleBlurOrEnter("FirstName")
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Last Name:</strong>
                    <input
                      type="text"
                      value={editableData.LastName || ""}
                      className="border rounded px-2 py-1 w-full"
                      onChange={(e) =>
                        handleEdit("LastName", e.target.value)
                      }
                      onBlur={() => handleBlurOrEnter("LastName")}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleBlurOrEnter("LastName")
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong>
                    <input
                      type="email"
                      value={editableData.email || ""}
                      className="border rounded px-2 py-1 w-full"
                      readOnly
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Phone:</strong>
                    <input
                      type="text"
                      value={editableData.contactNumber || ""}
                      className="border rounded px-2 py-1 w-full"
                      onChange={(e) => handleEdit("phone", e.target.value)}
                      onBlur={() => handleBlurOrEnter("phone")}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleBlurOrEnter("phone")
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Address:</strong>
                    <input
                      type="text"
                      value={`${editableData.houseNoStreet || ""}, ${
                        editableData.barangay || ""
                      }, ${editableData.city || ""}, ${
                        editableData.province || ""
                      }`}
                      className="border rounded px-2 py-1 w-full"
                      readOnly
                    />
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan-300 text-cyan-800 py-2 px-4 rounded-lg shadow hover:bg-cyan-400">
                    Update
                  </button>
                </div>
              )}
              {activeTab === "settings" && (
                <div>
                  <h3 className="text-lg font-bold mb-2 text-center">
                    Settings
                  </h3>
                  <div className="mb-2">
                    <p>Adjust your account settings below.</p>
                    <strong>Email:</strong>
                    <input
                      type="email"
                      value={editableData.email || ""}
                      className="border rounded px-2 py-1 w-full"
                      readOnly
                    />
                  </div>
                  <div className="mb-2">
                    <strong>Password:</strong>
                    <input
                      type="password"
                      value={editableData.password || ""}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                  <button className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan-300 text-cyan-800 py-2 px-4 rounded-lg shadow hover:bg-cyan-400">
                    Change Password
                  </button>
                </div>
              )}
              <button
                className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-400"
                onClick={() => setActiveTab(null)}
              >
                <ArrowLeft size={18} /> Return
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberProfile;
