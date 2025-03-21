import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import TimedepositAmountModal from "../../childModal/TimedepositAmountModal";

const MemberAndCoAccountForm = () => {
  // Retrieve selectedMember from React Router's state
  const location = useLocation();

  const { memberId } = useParams()
  const { selectedMember } = location.state || {};

  // If data was fetched, set a flag so fields are read-only
  const isFetchedData = Boolean(selectedMember);

  // Initialize form data with fetched member data where applicable.
  const [formData, setFormData] = useState({
    // MEMBERS’ PERSONAL INFORMATION
    accountType: "",
    memberCode: selectedMember?.memberCode || "",
    memberLastName: selectedMember?.last_name || "",
    memberMiddleName: selectedMember?.middle_name || "",
    memberFirstName: selectedMember?.first_name || "",
    memberExtension: "",
    memberDOB: "",
    memberPlaceOfBirth: "",
    memberAge: "",
    memberGender: "",
    memberCivilStatus: "",
    memberContactNumber: selectedMember?.contact_number || "",
    memberCompleteAddress: selectedMember?.barangay || "",

    // CO‑ACCOUNT HOLDER PERSONAL INFORMATION
    coLastName: "",
    coMiddleName: "",
    coFirstName: "",
    coExtension: "",
    coDOB: "",
    coPlaceOfBirth: "",
    coAge: "",
    coGender: "",
    coCivilStatus: "",
    coContactNumber: "",
    coRelationship: "",
    coCompleteAddress: "",
    coUploadPicture: null
  });

  // Change handlers for text/select fields and file uploads.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      coUploadPicture: file
    }));
  };

  // State to control display of the TimedepositAmountModal
  const [showAmountModal, setShowAmountModal] = useState(false);

  // When the Next button is clicked, show the modal.
  const handleNextClick = (e) => {
    e.preventDefault();
    // You can add additional form validations here if needed.
    setShowAmountModal(true);
  };

  // Example submit handler (if needed later)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Form data logged to console!");
  };

  return (
    <>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* MEMBERS’ PERSONAL INFORMATION */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">MEMBERS’ PERSONAL INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Account Type */}
            <div className="flex flex-col">
              <label className="font-semibold">Account Type:</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select an item</option>
                <option value="Savings">Savings</option>
                <option value="Time Deposit">Time Deposit</option>
                <option value="Share Capital">Share Capital</option>
              </select>
            </div>
            {/* Member Code */}
            <div className="flex flex-col">
              <label className="font-semibold">Member Code:</label>
              <input
                type="text"
                name="memberCode"
                value={formData.memberCode}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Member Code"
                readOnly={isFetchedData}
              />
            </div>
            {/* Last Name */}
            <div className="flex flex-col">
              <label className="font-semibold">Last Name:</label>
              <input
                type="text"
                name="memberLastName"
                value={formData.memberLastName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Last Name"
                readOnly={isFetchedData}
              />
            </div>
            {/* Middle Name */}
            <div className="flex flex-col">
              <label className="font-semibold">Middle Name:</label>
              <input
                type="text"
                name="memberMiddleName"
                value={formData.memberMiddleName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Middle Name"
                readOnly={isFetchedData}
              />
            </div>
            {/* First Name */}
            <div className="flex flex-col">
              <label className="font-semibold">First Name:</label>
              <input
                type="text"
                name="memberFirstName"
                value={formData.memberFirstName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="First Name"
                readOnly={isFetchedData}
              />
            </div>
            {/* Extension Name */}
            <div className="flex flex-col">
              <label className="font-semibold">Extension Name:</label>
              <input
                type="text"
                name="memberExtension"
                value={formData.memberExtension}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="e.g. Jr, Sr"
                readOnly={isFetchedData}
              />
            </div>
            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="font-semibold">Date of Birth:</label>
              <input
                type="date"
                name="memberDOB"
                value={formData.memberDOB}
                onChange={handleChange}
                className="border p-2 rounded"
                readOnly={isFetchedData}
              />
            </div>
            {/* Place of Birth */}
            <div className="flex flex-col">
              <label className="font-semibold">Place of Birth:</label>
              <input
                type="text"
                name="memberPlaceOfBirth"
                value={formData.memberPlaceOfBirth}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Place of Birth"
                readOnly={isFetchedData}
              />
            </div>
            {/* Age */}
            <div className="flex flex-col">
              <label className="font-semibold">Age:</label>
              <input
                type="number"
                name="memberAge"
                value={formData.memberAge}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Age"
                readOnly={isFetchedData}
              />
            </div>
            {/* Gender */}
            <div className="flex flex-col">
              <label className="font-semibold">Gender:</label>
              <select
                name="memberGender"
                value={formData.memberGender}
                onChange={handleChange}
                className="border p-2 rounded"
                disabled={isFetchedData}
              >
                <option value="">Select an item</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {/* Civil Status */}
            <div className="flex flex-col">
              <label className="font-semibold">Civil Status:</label>
              <select
                name="memberCivilStatus"
                value={formData.memberCivilStatus}
                onChange={handleChange}
                className="border p-2 rounded"
                disabled={isFetchedData}
              >
                <option value="">Select an item</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            {/* Contact Number */}
            <div className="flex flex-col">
              <label className="font-semibold">Contact Number:</label>
              <input
                type="text"
                name="memberContactNumber"
                value={formData.memberContactNumber}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Contact Number"
                readOnly={isFetchedData}
              />
            </div>
            {/* Complete Address */}
            <div className="flex flex-col">
              <label className="font-semibold">Complete Address:</label>
              <input
                type="text"
                name="memberCompleteAddress"
                value={formData.memberCompleteAddress}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Complete Address"
                readOnly={isFetchedData}
              />
            </div>
          </div>
        </section>

        {/* CO‑ACCOUNT HOLDER PERSONAL INFORMATION */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">CO‑ACCOUNT HOLDER PERSONAL INFORMATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="font-semibold">Last Name:</label>
              <input
                type="text"
                name="coLastName"
                value={formData.coLastName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Last Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Middle Name:</label>
              <input
                type="text"
                name="coMiddleName"
                value={formData.coMiddleName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Middle Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">First Name:</label>
              <input
                type="text"
                name="coFirstName"
                value={formData.coFirstName}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="First Name"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Extension Name:</label>
              <input
                type="text"
                name="coExtension"
                value={formData.coExtension}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="e.g. Jr, Sr"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Date of Birth:</label>
              <input
                type="date"
                name="coDOB"
                value={formData.coDOB}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Place of Birth:</label>
              <input
                type="text"
                name="coPlaceOfBirth"
                value={formData.coPlaceOfBirth}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Place of Birth"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Age:</label>
              <input
                type="number"
                name="coAge"
                value={formData.coAge}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Age"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Gender:</label>
              <select
                name="coGender"
                value={formData.coGender}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select an item</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Civil Status:</label>
              <select
                name="coCivilStatus"
                value={formData.coCivilStatus}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select an item</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widowed">Widowed</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Contact Number:</label>
              <input
                type="text"
                name="coContactNumber"
                value={formData.coContactNumber}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Contact Number"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Relationship to Primary:</label>
              <select
                name="coRelationship"
                value={formData.coRelationship}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select an item</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Sibling">Sibling</option>
                <option value="Parent">Parent</option>
                <option value="Relative">Relative</option>
                <option value="Friend">Friend</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Complete Address:</label>
              <input
                type="text"
                name="coCompleteAddress"
                value={formData.coCompleteAddress}
                onChange={handleChange}
                className="border p-2 rounded"
                placeholder="Complete Address"
              />
            </div>
          </div>
        </section>

        {/* Submit button */}
        <div className="flex justify-end mt-6 w-full">
          <button
            type="button"
            onClick={handleNextClick}
            className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
          >
            <span className="text-2xl">&#187;&#187;</span> Next
          </button>
        </div>
      </form>

      {showAmountModal && (
        <TimedepositAmountModal
          onClose={() => setShowAmountModal(false)}
          formData={formData}
        />
      )}
    </>
  );
};

export default MemberAndCoAccountForm;
