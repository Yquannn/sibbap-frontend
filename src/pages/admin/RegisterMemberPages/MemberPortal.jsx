import React from "react";
import { useNavigate } from "react-router-dom";

const MemberPortal = ({ handleSave, handlePrevious, formData, setFormData }) => {
  // Use parent's mobilePortal data or default to an object with empty strings
  const mobilePortal = formData.mobilePortal || { email: "", password: "" };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      mobilePortal: {
        ...mobilePortal,
        [name]: value,
      },
    }));
  };

  // This function calls the passed in handleSave and then navigates to the members page
  const onSaveAndNavigate = async () => {
    await handleSave();
    navigate("/members");
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white w-full max-w-3xl p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">MEMBER PORTAL</h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              className="border p-2 rounded-lg w-full"
              value={mobilePortal.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-2 items-center gap-4">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              className="border p-2 rounded-lg w-full"
              value={mobilePortal.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-700 text-white text-lg px-6 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-600 transition-all mr-6"
            onClick={handlePrevious}
            type="button"
          >
            <span className="text-2xl">&#171;&#171;</span> Previous
          </button>

          <button
            className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
            onClick={onSaveAndNavigate}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;
