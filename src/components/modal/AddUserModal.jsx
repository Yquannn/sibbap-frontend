import React, { useState, useEffect } from "react";
import axios from "axios";

const UserModal = ({ onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    gender: "",
    address: "",
    contactNo: "",
    email: "",
    password: "",
    userType: "",
  });

  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch user data for editing
  const fetchUserData = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/user/${id}`);
      if (response.data) {
        setFormData({
          userName: response.data.userName || "",
          age: response.data.age || "",
          gender: response.data.gender || "",
          address: response.data.address || "",
          contactNo: response.data.contactNo || "",
          email: response.data.email || "",
          password: response.data.password || "",
          userType: response.data.userType || "",
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err.message);
      setError("Failed to fetch user data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data when the modal opens (if a member is provided)
  useEffect(() => {
    if (user?.id) {
      fetchUserData(user.id);
    } else {
      // Reset the form if no member is passed (i.e., for adding a new user)
      setFormData({
        userName: "",
        age: "",
        gender: "",
        address: "",
        contactNo: "",
        email: "",
        password: "",
        userType: "",
      });
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save the user data (either create or update based on the member id)
  const handleSave = () => {
    if (!formData.userName || !formData.email) {
      alert("Full Name and Email are required.");
      return;
    }

    // Call the onSave function passed as a prop
    onSave(formData, user?.id); // Pass `member.id` for editing or null for new user
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2 relative z-10">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">
            &times;
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {user ? "Edit User" : "Add User"}
        </h1>

        {loading ? (
          <p>Loading user data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-gray-700">Full Name:</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Contact Number:</label>
              <input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">User Type:</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="System Admin">System Admin</option>
                <option value="General Manager">General Manager</option>
                <option value="Loan Officer">Loan Officer</option>
                <option value="Teller">Teller</option>
                {/* <option value="Member">Member</option> */}

              </select>
            </div>

            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
