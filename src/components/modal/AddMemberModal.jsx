import React, { useState, useEffect } from "react";
import axios from "axios";

const dropdownFields = {
  registrationType: ["New", "Transfer", "Regular Member"],
  memberType: ["Individual"],
  sex: ["Male", "Female", "Other"],
  civilStatus: ["Single", "Married", "Widowed", "Divorced"],
  highestEducationalAttainment: ["Primary", "Secondary", "Tertiary", "Post-Graduate", "Vocational"],
};

const AddMemberModal = ({ isOpen, onClose, onSave, memberIdToEdit }) => {
  const initialMemberState = {
    registrationType: "",
    memberType: "",
    registrationDate: "",
    shareCapital: "",
    LastName: "",
    FirstName: "",
    MiddleName: "",
    maidenName: "",
    tinNumber: "",
    dateOfBirth: "",
    birthplaceProvince: "",
    age: "",
    sex: "",
    civilStatus: "",
    highestEducationalAttainment: "",
    occupationSourceOfIncome: "",
    spouseName: "",
    spouseOccupationSourceOfIncome: "",
    primaryBeneficiaryName: "",
    primaryBeneficiaryRelationship: "",
    primaryBeneficiaryContact: "",
    secondaryBeneficiaryName: "",
    secondaryBeneficiaryRelationship: "",
    secondaryBeneficiaryContact: "",
    contactNumber: "",
    houseNoStreet: "",
    barangay: "",
    city: "",
    referenceName: "",
    position: "",
    referenceContact: "",
    email: "",
    password: "",
    idPicture: null,
  };

  const [memberData, setMemberData] = useState(initialMemberState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && memberIdToEdit) {
      fetchMemberDetails();
    } else {
      resetForm();
    }
  }, [memberIdToEdit, isOpen]);

  const fetchMemberDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/members/${memberIdToEdit}`);
      setMemberData(response.data);
    } catch (error) {
      console.error("Failed to fetch member data", error);
      setErrors({ fetch: "Failed to load member data. Please try again." });
    }
  };

  const resetForm = () => {
    setMemberData(initialMemberState);
    setErrors({});
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const formattedValue = type === "number" ? Number(value) : value; // Convert to number if input type is number
    setMemberData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    setMemberData((prev) => ({ ...prev, idPicture: e.target.files[0] }));
  };

  const validateFormData = (data) => {
    const requiredFields = ["FirstName", "LastName"];
    return requiredFields.every((field) => data[field] !== undefined && data[field] !== "");
  };

  const handleAddMember = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      Object.entries(memberData).forEach(([key, value]) => {
        if (key === "idPicture" && value instanceof File) {
          formData.append(key, value);
        } else if (value) {
          formData.append(key, value);
        }
      });

      const response = await axios.post("http://localhost:3001/api/members", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSave(response.data.message || "Member added successfully!");
      alert("Member added successfully!");
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);

      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred while adding the member.";
      alert(`Error adding member: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateFormData(memberData)) {
      alert("Please fill in all required fields.");
      return;
    }
    handleAddMember();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative z-10 max-h-[80vh] overflow-auto">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-red-500 text-2xl font-bold">
            &times;
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Member</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(initialMemberState).map((key) => (
            <div key={key} className="mt-4">
              <label className="block text-gray-700">{key.replace(/([A-Z])/g, " $1")}:</label>
              {key === "shareCapital" ? (
                <input
                  name={key}
                  type="number"
                  value={memberData[key]}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 border ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                />
              ) : key === "registrationDate" || key === "dateOfBirth" ? (
                <input
                  name={key}
                  type="date"
                  value={memberData[key]}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 border ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                />
              ) : dropdownFields[key] ? (
                <select
                  name={key}
                  value={memberData[key]}
                  onChange={handleInputChange}
                  className={`mt-1 p-2 border ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                >
                  <option value="">Select {key}</option>
                  {dropdownFields[key].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={key}
                  type={key === "idPicture" ? "file" : "text"}
                  value={key === "idPicture" ? undefined : memberData[key]}
                  onChange={key === "idPicture" ? handleFileChange : handleInputChange}
                  className={`mt-1 p-2 border ${
                    errors[key] ? "border-red-500" : "border-gray-300"
                  } rounded-md w-full`}
                />
              )}
            </div>
          ))}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;
