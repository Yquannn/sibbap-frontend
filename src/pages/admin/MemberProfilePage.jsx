import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MemberProfilePage = () => {
  const { memberId } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab navigation
  const [activeTab, setActiveTab] = useState("personal");

  // Activation/loading and message states
  const [activationLoading, setActivationLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [message, setMessage] = useState("");

  // Define an array of background color classes for fallback
  const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
  ];

  // Helper to compute a consistent background color based on member's unique id
  const getMemberFallbackColor = (member) => {
    // Use memberId if available; otherwise, fall back to name concatenation
    let id = member.memberId ? String(member.memberId) : `${member.first_name || ""}${member.last_name || ""}`;
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bgColors.length;
    return bgColors[index];
  };

  // Helper to build an image URL
  const imageUrl = (filename) =>
    filename ? `http://localhost:3001/uploads/${filename}` : "";

  // Helper to format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch the member data from your API
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/members/${memberId}`
        );
        setMember(response.data);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setMessage("Error fetching member data.");
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchMember();
    } else {
      setMessage("Member ID is missing!");
      setLoading(false);
    }
  }, [memberId]);

  if (loading) return <p className="p-8 text-xl">Loading...</p>;
  if (!member) return <p className="p-8 text-xl">{message}</p>;

  // ------------------ PERSONAL INFO (3-COLUMN LAYOUT) ------------------
  const PersonalInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMember, setEditedMember] = useState(member);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedMember((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCancel = () => {
      setEditedMember(member); // revert changes
      setIsEditing(false);
    };

    const handleSave = async () => {
      try {
        const response = await axios.put(
          `http://localhost:3001/api/members/${memberId}`,
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

    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0 flex items-center">
            {imageUrl(member.id_picture) ? (
              <img
                src={imageUrl(member.id_picture)}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-400 shadow-md"
              />
            ) : (
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 border-gray-400 shadow-md ${getMemberFallbackColor(
                  member
                )}`}
              >
                <span className="text-3xl font-bold text-white">
                  {`${member.first_name?.charAt(0) || ""}${member.last_name?.charAt(0) || ""}`}
                </span>
              </div>
            )}
            <div className="ml-6">
              <h2 className="text-3xl font-bold">
                {member.first_name} {member.last_name}
              </h2>
              <p className="text-lg text-gray-600">{member.member_type}</p>
            </div>
          </div>
          {/* Quick info on the right (e.g., date of birth) */}
          <div className="mt-6 md:mt-0 md:ml-auto text-lg text-gray-700">
            <strong>DOB:</strong>{" "}
            {member.date_of_birth ? formatDate(member.date_of_birth) : "N/A"}
          </div>
        </div>

        <hr className="my-6" />

        {/* "Basic Information" in 3 columns */}
        <h3 className="text-2xl font-bold mb-4">Basic Information</h3>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                First Name
                <input
                  type="text"
                  name="first_name"
                  value={editedMember.first_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Middle Name
                <input
                  type="text"
                  name="middle_name"
                  value={editedMember.middle_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Last Name
                <input
                  type="text"
                  name="last_name"
                  value={editedMember.last_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Extension Name
                <input
                  type="text"
                  name="extension_name"
                  value={editedMember.extension_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Maiden Name
                <input
                  type="text"
                  name="maiden_name"
                  value={editedMember.maiden_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                Sex
                <input
                  type="text"
                  name="sex"
                  value={editedMember.sex || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Age
                <input
                  type="number"
                  name="age"
                  value={editedMember.age || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Civil Status
                <input
                  type="text"
                  name="civil_status"
                  value={editedMember.civil_status || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Religion
                <input
                  type="text"
                  name="religion"
                  value={editedMember.religion || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Birthplace Province
                <input
                  type="text"
                  name="birthplace_province"
                  value={editedMember.birthplace_province || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                Registration Type
                <input
                  type="text"
                  name="registration_type"
                  value={editedMember.registration_type || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Registration Date
                <input
                  type="date"
                  name="registration_date"
                  value={
                    editedMember.registration_date
                      ? editedMember.registration_date.slice(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Member Type
                <input
                  type="text"
                  name="member_type"
                  value={editedMember.member_type || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Status
                <input
                  type="text"
                  name="status"
                  value={editedMember.status || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Is Borrower
                <input
                  type="number"
                  name="is_borrower"
                  value={editedMember.is_borrower || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>
          </div>
        ) : (
          // READ-ONLY 3-COLUMN LAYOUT
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-lg">
            {/* Column 1 */}
            <div>
              <p>
                <strong>First Name:</strong> {member.first_name || "N/A"}
              </p>
              <p>
                <strong>Middle Name:</strong> {member.middle_name || "N/A"}
              </p>
              <p>
                <strong>Last Name:</strong> {member.last_name || "N/A"}
              </p>
              <p>
                <strong>Extension Name:</strong> {member.extension_name || "N/A"}
              </p>
              <p>
                <strong>Maiden Name:</strong> {member.maiden_name || "N/A"}
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <p>
                <strong>Sex:</strong> {member.sex || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {member.age || "N/A"}
              </p>
              <p>
                <strong>Civil Status:</strong> {member.civil_status || "N/A"}
              </p>
              <p>
                <strong>Religion:</strong> {member.religion || "N/A"}
              </p>
              <p>
                <strong>Birthplace Province:</strong>{" "}
                {member.birthplace_province || "N/A"}
              </p>
            </div>

            {/* Column 3 */}
            <div>
              <p>
                <strong>Registration Type:</strong>{" "}
                {member.registration_type || "N/A"}
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {member.registration_date
                  ? formatDate(member.registration_date)
                  : "N/A"}
              </p>
              <p>
                <strong>Member Type:</strong> {member.member_type || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {member.status || "N/A"}
              </p>
              <p>
                <strong>Is Borrower:</strong> {member.is_borrower || 0}
              </p>
            </div>
          </div>
        )}

        {/* Additional Details Section */}
        <h3 className="text-2xl font-bold mb-4">Additional Details</h3>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-lg">
            {/* Column for Finances */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                Annual Income
                <input
                  type="number"
                  name="annual_income"
                  value={editedMember.annual_income || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Number of Dependents
                <input
                  type="text"
                  name="number_of_dependents"
                  value={editedMember.number_of_dependents || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Share Capital
                <input
                  type="text"
                  name="share_capital"
                  value={editedMember.share_capital || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Membership Fee
                <input
                  type="number"
                  name="membership_fee"
                  value={editedMember.membership_fee || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Initial Savings
                <input
                  type="number"
                  name="initial_savings"
                  value={editedMember.initial_savings || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>

            {/* Column for Spouse & Occupation */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                Occupation
                <input
                  type="text"
                  name="occupation_source_of_income"
                  value={editedMember.occupation_source_of_income || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Spouse Name
                <input
                  type="text"
                  name="spouse_name"
                  value={editedMember.spouse_name || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Spouse Occupation
                <input
                  type="text"
                  name="spouse_occupation_source_of_income"
                  value={editedMember.spouse_occupation_source_of_income || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>

            {/* Column for Address & Contact */}
            <div className="space-y-4">
              <label className="block text-base font-medium">
                House No/Street
                <input
                  type="text"
                  name="house_no_street"
                  value={editedMember.house_no_street || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Barangay
                <input
                  type="text"
                  name="barangay"
                  value={editedMember.barangay || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                City
                <input
                  type="text"
                  name="city"
                  value={editedMember.city || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                Contact Number
                <input
                  type="text"
                  name="contact_number"
                  value={editedMember.contact_number || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
              <label className="block text-base font-medium">
                TIN Number
                <input
                  type="text"
                  name="tin_number"
                  value={editedMember.tin_number || ""}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 w-full text-lg"
                />
              </label>
            </div>
          </div>
        ) : (
          // READ-ONLY for Additional Details
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 text-lg">
            {/* Column 1: Finances */}
            <div>
              <p>
                <strong>Annual Income:</strong> {member.annual_income || "N/A"}
              </p>
              <p>
                <strong>Number of Dependents:</strong>{" "}
                {member.number_of_dependents || "N/A"}
              </p>
              <p>
                <strong>Share Capital:</strong> {member.share_capital || "N/A"}
              </p>
              <p>
                <strong>Membership Fee:</strong> {member.membership_fee || "N/A"}
              </p>
              <p>
                <strong>Initial Savings:</strong> {member.initial_savings || "N/A"}
              </p>
            </div>

            {/* Column 2: Spouse & Occupation */}
            <div>
              <p>
                <strong>Occupation:</strong>{" "}
                {member.occupation_source_of_income || "N/A"}
              </p>
              <p>
                <strong>Spouse Name:</strong> {member.spouse_name || "N/A"}
              </p>
              <p>
                <strong>Spouse Occupation:</strong>{" "}
                {member.spouse_occupation_source_of_income || "N/A"}
              </p>
            </div>

            {/* Column 3: Address & Contact */}
            <div>
              <p>
                <strong>House No/Street:</strong> {member.house_no_street || "N/A"}
              </p>
              <p>
                <strong>Barangay:</strong> {member.barangay || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {member.city || "N/A"}
              </p>
              <p>
                <strong>Contact Number:</strong> {member.contact_number || "N/A"}
              </p>
              <p>
                <strong>TIN Number:</strong> {member.tin_number || "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* Edit / Save / Cancel Buttons */}
        <div className="mt-8">
          {isEditing ? (
            <div className="flex gap-6">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 text-xl"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-xl"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    );
  };

  // ------------------ DOCUMENTS TAB ------------------
  const DocumentsTab = () => (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h3 className="text-3xl font-bold mb-6">Documents</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
        {member.id_picture && (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-600 mb-2">ID Picture</p>
            <a
              href={imageUrl(member.id_picture)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl(member.id_picture)}
                alt="ID"
                className="w-40 h-40 object-cover rounded shadow-lg hover:opacity-80 transition"
              />
            </a>
          </div>
        )}
        {member.barangay_clearance && (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Barangay Clearance
            </p>
            <a
              href={imageUrl(member.barangay_clearance)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl(member.barangay_clearance)}
                alt="Barangay Clearance"
                className="w-40 h-40 object-cover rounded shadow-lg hover:opacity-80 transition"
              />
            </a>
          </div>
        )}
        {member.tax_identification_id && (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-600 mb-2">
              TIN Document
            </p>
            <a
              href={imageUrl(member.tax_identification_id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl(member.tax_identification_id)}
                alt="TIN"
                className="w-40 h-40 object-cover rounded shadow-lg hover:opacity-80 transition"
              />
            </a>
          </div>
        )}
        {member.valid_id && (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-600 mb-2">Valid ID</p>
            <a
              href={imageUrl(member.valid_id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl(member.valid_id)}
                alt="Valid ID"
                className="w-40 h-40 object-cover rounded shadow-lg hover:opacity-80 transition"
              />
            </a>
          </div>
        )}
        {member.membership_agreement && (
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-gray-600 mb-2">
              Membership Agreement
            </p>
            <a
              href={imageUrl(member.membership_agreement)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={imageUrl(member.membership_agreement)}
                alt="Membership Agreement"
                className="w-40 h-40 object-cover rounded shadow-lg hover:opacity-80 transition"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );

  // ------------------ BENEFICIARIES & REFERENCES TAB ------------------
  const BeneficiariesReferences = () => (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h3 className="text-3xl font-bold mb-6">Beneficiaries & References</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-gray-700 text-xl">
        <div>
          <h4 className="text-2xl font-semibold mb-4">Beneficiaries</h4>
          <p>
            <strong>Name:</strong> {member.beneficiaryName || "N/A"}
          </p>
          <p>
            <strong>Relationship:</strong> {member.relationship || "N/A"}
          </p>
          <p>
            <strong>Contact:</strong>{" "}
            {member.beneficiary_contactNumber || "N/A"}
          </p>
        </div>
        <div>
          <h4 className="text-2xl font-semibold mb-4">
            Character Reference
          </h4>
          <p>
            <strong>Name:</strong> {member.referenceName || "N/A"}
          </p>
          <p>
            <strong>Position:</strong> {member.position || "N/A"}
          </p>
          <p>
            <strong>Contact:</strong>{" "}
            {member.reference_contactNumber || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );

  // ------------------ ACCOUNT INFO TAB ------------------
  const AccountInfo = () => (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-6 text-gray-700 text-xl">
      <h3 className="text-3xl font-bold mb-6">Account Info</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="font-bold">Email:</p>
          <p>{member.email}</p>
        </div>
        <div>
          <p className="font-bold">Password:</p>
          <p>{member.password}</p>
        </div>
        <div>
          <p className="font-bold">Account Status:</p>
          <p>{member.accountStatus}</p>
        </div>
      </div>
      {member.accountStatus &&
        member.accountStatus.toUpperCase() !== "ACTIVATED" && (
          <button
            onClick={async () => {
              setActivationLoading(true);
              try {
                await axios.put(
                  `http://localhost:3001/api/activate/${member.memberId}`
                );
                setMember((prev) => ({ ...prev, accountStatus: "ACTIVATED" }));
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
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition text-xl"
            disabled={activationLoading}
          >
            {activationLoading ? "Activating..." : "Activate Account"}
          </button>
        )}
    </div>
  );

  // ------------------ LOAN HISTORY TAB ------------------
  const LoanHistory = () => {
    if (!member.loan_history || member.loan_history.length === 0) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-600 text-xl">No loan history available.</p>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h3 className="text-3xl font-bold mb-6">Loan History</h3>
        {member.loan_history.map((loan, index) => (
          <div key={index} className="border p-6 rounded-lg shadow-sm bg-gray-50">
            <p className="text-xl">
              <strong>Loan Type:</strong> {loan.loan_type}
            </p>
            <p className="text-xl">
              <strong>Amount:</strong> ₱{loan.loan_amount}
            </p>
            <p className="text-xl">
              <strong>Term:</strong> {loan.terms} months
            </p>
            <p className="text-xl">
              <strong>Status:</strong> {loan.status}
            </p>
            <p className="text-lg text-gray-500">
              Applied on: {formatDate(loan.application_date)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // ------------------ INITIAL CONTRIBUTION TAB ------------------
  const InitialContribution = () => {
    if (!member.initial_contribution) {
      return (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-gray-600 text-xl">No initial contribution data.</p>
        </div>
      );
    }

    const contrib = member.initial_contribution;
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-4 text-gray-700 text-xl">
        <h3 className="text-3xl font-bold mb-6">Initial Contribution</h3>
        <p>
          <strong>Share Capital Contribution Amount:</strong> ₱{contrib.share_capital}
        </p>
        <p>
          <strong>Identification Card Fee:</strong> ₱{contrib.identification_card_fee}
        </p>
        <p>
          <strong>Membership Fee:</strong> ₱{contrib.membership_fee}
        </p>
        <p>
          <strong>Kalinga Fund Fee:</strong> ₱{contrib.kalinga_fund_fee}
        </p>
        <p>
          <strong>Initial Savings:</strong> ₱{contrib.initial_savings}
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
    <div className="border-b border-gray-300 mb-8">
      <ul className="flex space-x-8">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-xl font-semibold tracking-wide ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-4 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  // ----------------- RENDER PAGE -----------------
  return (
    <div className="">
      {/* Page Title / Subtitle */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <p className="text-xl text-gray-500">Manage Account Settings</p>
      </div>

      {/* Tab Navigation */}
      {renderTabHeaders()}

      {/* Tab Content */}
      {activeTab === "personal" && <PersonalInfo />}
      {activeTab === "documents" && <DocumentsTab />}
      {activeTab === "beneficiaries" && <BeneficiariesReferences />}
      {activeTab === "account" && <AccountInfo />}
      {activeTab === "loan" && <LoanHistory />}
      {activeTab === "contribution" && <InitialContribution />}
    </div>
  );
};

export default MemberProfilePage;
