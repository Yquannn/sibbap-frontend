import React, { useState } from "react";
import axios from "axios";

const MemberProfileModal = ({ isOpen, onClose, member: initialMember }) => {
  // Store the member data in local state so we can update it after editing
  const [member, setMember] = useState(initialMember);
  // Tab navigation state
  const [activeTab, setActiveTab] = useState("personal");
  // Activation/loading and message states
  const [activationLoading, setActivationLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [message, setMessage] = useState("");

  if (!isOpen || !member) return null;

  // Helper to build an image URL (adjust base URL as needed)
 const imageUrl = (filename) =>
    filename ? `http://localhost:3001/uploads/${filename}` : "";
 
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ------------------ PERSONAL INFO WITH EDIT FEATURE ------------------
  const PersonalInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    // Local state for editing all fields
    const [editedMember, setEditedMember] = useState(member);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedMember((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCancel = () => {
      setEditedMember(member);
      setIsEditing(false);
    };

    const handleSave = async () => {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/members/${member.memberId}`,
          editedMember
        );
        setMember(response.data.updatedMember || editedMember);
        setIsEditing(false);
        setMessageType("success");
        setMessage("Profile updated successfully!");
        setShowMessage(true);
      } catch (error) {
        console.error("Error updating profile:", error);
        setMessageType("error");
        setMessage("Error updating profile.");
        setShowMessage(true);
      }
    };

    // ------------------ READ-ONLY VIEW ------------------
    if (!isEditing) {
      return (
        <div className="bg-white p-6 md:p-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Member Picture */}
            <div className="flex-shrink-0">
              <img
                src={imageUrl(member.id_picture)}
                alt="Member ID"
                className="w-36 h-36 rounded-full object-cover border-4 border-green-500 shadow-md"
              />
            </div>
            {/* Member Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                <h3 className="text-4xl font-bold text-gray-800 leading-tight">
                  {member.last_name}, {member.first_name} {member.middle_name}
                </h3>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 sm:mt-0 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 text-base">
                {/* Left Column */}
                <div>
                  <p className="mb-1">
                    <span className="font-semibold">Member Code:</span> {member.memberCode}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Member Type:</span> {member.member_type}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Registration Type:</span> {member.registration_type}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Birthplace:</span>{" "}
                    {member.birth_place_province || member.birthplace_province}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Religion:</span> {member.religion}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Annual Income:</span> {member.annual_income}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Dependents:</span> {member.number_of_dependents}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Spouse Name:</span>{" "}
                    {member.name_of_spouse || member.spouse_name}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Occupation:</span> {member.occupation_source_of_income}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Spouse Occupation:</span>{" "}
                    {member.spouse_occupation_source_of_income}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">TIN:</span> {member.tin_number}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">DOB:</span> {formatDate(member.date_of_birth)}
                  </p>
                </div>
                {/* Right Column */}
                <div>
                  <p className="mb-1">
                    <span className="font-semibold">Civil Status:</span> {member.civil_status}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Sex:</span> {member.sex}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Age:</span> {member.age}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Contact:</span> {member.contact_number}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Address:</span>
                    <br />
                    {member.house_no_street}, {member.barangay}, {member.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ------------------ EDITING VIEW ------------------
    return (
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-xl w-full max-w-7xl mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex-1">Edit Profile</h3>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Member Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Member Code
              </label>
              <input
                type="text"
                name="memberCode"
                value={editedMember.memberCode || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Member Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Member Type
              </label>
              <input
                type="text"
                name="member_type"
                value={editedMember.member_type || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Registration Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Registration Type
              </label>
              <input
                type="text"
                name="registration_type"
                value={editedMember.registration_type || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Birthplace */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Birthplace
              </label>
              <input
                type="text"
                name="birth_place_province"
                value={
                  editedMember.birth_place_province ||
                  editedMember.birthplace_province ||
                  ""
                }
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Religion */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                value={editedMember.religion || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Annual Income */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Annual Income
              </label>
              <input
                type="number"
                name="annual_income"
                value={editedMember.annual_income || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Number of Dependents */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Number of Dependents
              </label>
              <input
                type="number"
                name="number_of_dependents"
                value={editedMember.number_of_dependents || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Spouse Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Spouse Name
              </label>
              <input
                type="text"
                name="spouse_name"
                value={editedMember.spouse_name || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Occupation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Occupation/Source of Income
              </label>
              <input
                type="text"
                name="occupation_source_of_income"
                value={editedMember.occupation_source_of_income || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Spouse Occupation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Spouse Occupation/Source of Income
              </label>
              <input
                type="text"
                name="spouse_occupation_source_of_income"
                value={editedMember.spouse_occupation_source_of_income || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* TIN */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                TIN
              </label>
              <input
                type="text"
                name="tin_number"
                value={editedMember.tin_number || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={editedMember.date_of_birth || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-4">
            {/* Civil Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Civil Status
              </label>
              <input
                type="text"
                name="civil_status"
                value={editedMember.civil_status || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Sex */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sex
              </label>
              <input
                type="text"
                name="sex"
                value={editedMember.sex || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Age */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={editedMember.age || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="text"
                name="contact_number"
                value={editedMember.contact_number || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* House No/Street */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                House No/Street
              </label>
              <input
                type="text"
                name="house_no_street"
                value={editedMember.house_no_street || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Barangay */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Barangay
              </label>
              <input
                type="text"
                name="barangay"
                value={editedMember.barangay || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={editedMember.city || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ------------------ DOCUMENTS TAB ------------------
  const DocumentsTab = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {member.id_picture && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-600 mb-1">ID Picture</p>
          <a href={imageUrl(member.id_picture)} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl(member.id_picture)}
              alt="ID Picture"
              className="w-28 h-28 object-cover rounded shadow-md hover:opacity-75 transition"
            />
          </a>
        </div>
      )}
      {member.barangay_clearance && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-600 mb-1">Barangay Clearance</p>
          <a href={imageUrl(member.barangay_clearance)} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl(member.barangay_clearance)}
              alt="Barangay Clearance"
              className="w-28 h-28 object-cover rounded shadow-md hover:opacity-75 transition"
            />
          </a>
        </div>
      )}
      {member.tax_identification_id && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-600 mb-1">TIN Document</p>
          <a href={imageUrl(member.tax_identification_id)} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl(member.tax_identification_id)}
              alt="TIN Document"
              className="w-28 h-28 object-cover rounded shadow-md hover:opacity-75 transition"
            />
          </a>
        </div>
      )}
      {member.valid_id && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-600 mb-1">Valid ID</p>
          <a href={imageUrl(member.valid_id)} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl(member.valid_id)}
              alt="Valid ID"
              className="w-28 h-28 object-cover rounded shadow-md hover:opacity-75 transition"
            />
          </a>
        </div>
      )}
      {member.membership_agreement && (
        <div className="flex flex-col items-center">
          <p className="text-sm font-semibold text-gray-600 mb-1">Membership Agreement</p>
          <a href={imageUrl(member.membership_agreement)} target="_blank" rel="noopener noreferrer">
            <img
              src={imageUrl(member.membership_agreement)}
              alt="Membership Agreement"
              className="w-28 h-28 object-cover rounded shadow-md hover:opacity-75 transition"
            />
          </a>
        </div>
      )}
    </div>
  );

  // ------------------ BENEFICIARIES & REFERENCES TAB ------------------
  const BeneficiariesReferences = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
      <div>
        <h3 className="text-xl font-bold mb-2">Beneficiaries</h3>
        <p>
          <span className="font-bold">Name:</span> {member.beneficiaryName || "N/A"}
        </p>
        <p>
          <span className="font-bold">Relationship:</span> {member.relationship || "N/A"}
        </p>
        <p>
          <span className="font-bold">Contact:</span> {member.beneficiary_contactNumber || "N/A"}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Character Reference</h3>
        <p>
          <span className="font-bold">Name:</span> {member.referenceName || "N/A"}
        </p>
        <p>
          <span className="font-bold">Position:</span> {member.position || "N/A"}
        </p>
        <p>
          <span className="font-bold">Contact:</span> {member.reference_contactNumber || "N/A"}
        </p>
      </div>
    </div>
  );

  // ------------------ ACCOUNT INFO TAB ------------------
  const AccountInfo = () => (
    <div className="space-y-4 text-gray-700 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="font-bold">Email:</p>
          <p>{member.email}</p>
        </div>
        <div>
          <p className="font-bold">Password:</p>
          <p>{member.password}</p>
        </div>
        <div>
          <p className="font-bold">Status:</p>
          <p>{member.accountStatus}</p>
        </div>
      </div>
      {member.accountStatus &&
        member.accountStatus.toUpperCase() !== "ACTIVATED" && (
          <button
            onClick={async () => {
              setActivationLoading(true);
              try {
                const response = await axios.put(
                  `http://localhost:3001/api/activate/${member.memberId}`
                );
                member.accountStatus = "ACTIVATED";
                member.email = member.memberCode;
                member.password = member.memberCode;
                setMessageType("success");
                setMessage("Account activated successfully!");
                setShowMessage(true);
              } catch (error) {
                console.error("Error activating account:", error);
                setMessageType("error");
                setMessage("Error activating account.");
                setShowMessage(true);
              } finally {
                setActivationLoading(false);
              }
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            disabled={activationLoading}
          >
            {activationLoading ? "Activating..." : "Activate Account"}
          </button>
        )}
    </div>
  );

  // ------------------ LOAN HISTORY TAB ------------------
  const LoanHistory = () => {
    if (!member.loan_history || member.loan_history.length === 0)
      return <p className="text-gray-600">No loan history available.</p>;

    return (
      <div className="space-y-4">
        {member.loan_history.map((loan, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <p className="text-sm">
              <span className="font-bold">Loan Type:</span> {loan.loan_type}
            </p>
            <p className="text-sm">
              <span className="font-bold">Amount:</span> ₱{loan.loan_amount}
            </p>
            <p className="text-sm">
              <span className="font-bold">Term:</span> {loan.terms} months
            </p>
            <p className="text-sm">
              <span className="font-bold">Status:</span> {loan.status}
            </p>
            <p className="text-xs text-gray-500">
              Applied on: {formatDate(loan.application_date)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // ------------------ INITIAL CONTRIBUTION TAB ------------------
  const InitialContribution = () => {
    if (!member.initial_contribution)
      return <p className="text-gray-600">No initial contribution data.</p>;

    const contrib = member.initial_contribution;
    return (
      <div className="space-y-2 text-gray-700 text-sm">
        <p>
          <span className="font-bold">Share Capital Contribution Amount:</span> ₱{contrib.share_capital}
        </p>
        <p>
          <span className="font-bold">Identification Card Fee:</span> ₱{contrib.tax_identification_id}
        </p>
        <p>
          <span className="font-bold">Membership Fee:</span> ₱{contrib.membership_fee}
        </p>
        <p>
          <span className="font-bold">Kalinga Fund Fee:</span> ₱{contrib.kalinga_fund_fee}
        </p>
        <p>
          <span className="font-bold">Initial Savings:</span> ₱{contrib.initial_savings}
        </p>
      </div>
    );
  };

  // ----------------- TAB HEADERS -----------------
  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "documents", label: "Documents" },
    { id: "beneficiaries", label: "Beneficiaries" },
    { id: "account", label: "Account Info" },
    { id: "loan", label: "Loan History" },
    { id: "contribution", label: "Initial Contribution" },
  ];

  const renderTabHeaders = () => (
    <div className="flex border-b border-gray-300 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 -mb-px text-lg font-semibold transition-colors ${
            activeTab === tab.id
              ? "border-b-4 border-green-600 text-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // ----------------- RENDER MODAL -----------------
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl overflow-auto max-h-screen">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-3xl font-bold text-gray-800">Member Profile</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-3xl">
            &times;
          </button>
        </div>
        {/* Tab Headers */}
        <div className="px-6 py-4">{renderTabHeaders()}</div>
        {/* Tab Content */}
        {activeTab === "personal" && <div className="px-6 py-4"><PersonalInfo /></div>}
        {activeTab === "documents" && <div className="px-6 py-4"><DocumentsTab /></div>}
        {activeTab === "beneficiaries" && <div className="px-6 py-4"><BeneficiariesReferences /></div>}
        {activeTab === "account" && <div className="px-6 py-4"><AccountInfo /></div>}
        {activeTab === "loan" && <div className="px-6 py-4"><LoanHistory /></div>}
        {activeTab === "contribution" && <div className="px-6 py-4"><InitialContribution /></div>}
        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
