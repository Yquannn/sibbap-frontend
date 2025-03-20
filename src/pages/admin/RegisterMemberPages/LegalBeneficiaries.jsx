import React from "react";

const LegalBeneficiaries = ({
  handleNext,
  handlePrevious,
  formData,
  setFormData,
}) => {
  // Default structure for legal beneficiaries
  const defaultLegalBeneficiaries = {
    primary: { fullName: "", relationship: "", contactNumber: "" },
    secondary: { fullName: "", relationship: "", contactNumber: "" },
    characterReferences: [
      { fullName: "", position: "", contactNumber: "" },
      { fullName: "", position: "", contactNumber: "" },
    ],
  };

  // Merge parent's legalBeneficiaries with defaults so that all keys exist.
  const legalBeneficiaries = {
    ...defaultLegalBeneficiaries,
    ...formData.legalBeneficiaries,
    primary: {
      ...defaultLegalBeneficiaries.primary,
      ...(formData.legalBeneficiaries?.primary || {}),
    },
    secondary: {
      ...defaultLegalBeneficiaries.secondary,
      ...(formData.legalBeneficiaries?.secondary || {}),
    },
    characterReferences:
      formData.legalBeneficiaries?.characterReferences?.length > 0
        ? formData.legalBeneficiaries.characterReferences
        : defaultLegalBeneficiaries.characterReferences,
  };

  // Handler for Primary Beneficiary inputs
  const handlePrimaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      legalBeneficiaries: {
        ...legalBeneficiaries,
        primary: { ...legalBeneficiaries.primary, [name]: value },
      },
    }));
  };

  // Handler for Secondary Beneficiary inputs
  const handleSecondaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      legalBeneficiaries: {
        ...legalBeneficiaries,
        secondary: { ...legalBeneficiaries.secondary, [name]: value },
      },
    }));
  };

  // Handler for Character References inputs
  const handleCharacterChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReferences = legalBeneficiaries.characterReferences.map(
      (ref, i) => (i === index ? { ...ref, [name]: value } : ref)
    );
    setFormData((prev) => ({
      ...prev,
      legalBeneficiaries: {
        ...legalBeneficiaries,
        characterReferences: updatedReferences,
      },
    }));
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-full h-full max-w-none rounded-lg p-6">
        {/* Legal Beneficiaries Header */}
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          LEGAL BENEFICIARIES
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {/* Primary Beneficiary */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label>Primary:</label>
            <input
              name="fullName"
              className="border p-2 rounded-lg w-full"
              placeholder="Full Name"
              value={legalBeneficiaries.primary.fullName}
              onChange={handlePrimaryChange}
            />
            <input
              name="relationship"
              className="border p-2 rounded-lg w-full"
              placeholder="Relationship"
              value={legalBeneficiaries.primary.relationship}
              onChange={handlePrimaryChange}
            />
            <input
              name="contactNumber"
              className="border p-2 rounded-lg w-full"
              placeholder="Contact Number"
              value={legalBeneficiaries.primary.contactNumber}
              onChange={handlePrimaryChange}
            />
          </div>

          {/* Secondary Beneficiary */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label>Secondary:</label>
            <input
              name="fullName"
              className="border p-2 rounded-lg w-full"
              placeholder="Full Name"
              value={legalBeneficiaries.secondary.fullName}
              onChange={handleSecondaryChange}
            />
            <input
              name="relationship"
              className="border p-2 rounded-lg w-full"
              placeholder="Relationship"
              value={legalBeneficiaries.secondary.relationship}
              onChange={handleSecondaryChange}
            />
            <input
              name="contactNumber"
              className="border p-2 rounded-lg w-full"
              placeholder="Contact Number"
              value={legalBeneficiaries.secondary.contactNumber}
              onChange={handleSecondaryChange}
            />
          </div>
        </div>

        {/* Character References Header */}
        <h2 className="text-2xl font-bold text-green-600 mt-6 mb-4">
          CHARACTER REFERENCES
        </h2>

        <div className="space-y-4">
          {legalBeneficiaries.characterReferences.map((ref, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="mb-1">Full Name</label>
                <input
                  name="fullName"
                  className="border p-2 rounded-lg"
                  placeholder="Full Name"
                  value={ref.fullName}
                  onChange={(e) => handleCharacterChange(index, e)}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Position</label>
                <input
                  name="position"
                  className="border p-2 rounded-lg"
                  placeholder="Position"
                  value={ref.position}
                  onChange={(e) => handleCharacterChange(index, e)}
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1">Contact Number</label>
                <input
                  name="contactNumber"
                  className="border p-2 rounded-lg"
                  placeholder="Contact Number"
                  value={ref.contactNumber}
                  onChange={(e) => handleCharacterChange(index, e)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-800 transition-all mr-4"
            onClick={handlePrevious}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Previous
          </button>
          <button
            className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
            onClick={handleNext}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalBeneficiaries;
