import React from "react";

const EmergencySection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  emergencyOtherPurpose,
  setEmergencyOtherPurpose,
  setEmergencyDocument,
  terms,
  setTerms,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Statement of Purpose:
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={statementOfPurpose}
          onChange={(e) => setStatementOfPurpose(e.target.value)}
        >
          <option value="medical">Medical Emergency Loan</option>
          <option value="funeral">Funeral Assistance</option>
          <option value="fire">Fire Victim</option>
          <option value="other">Other Calamities</option>
        </select>
      </div>
      {statementOfPurpose === "other" && (
        <div className="mb-4">
          <label className="block font-medium text-gray-700">
            Please specify:
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Specify Calamity"
            value={emergencyOtherPurpose}
            onChange={(e) => setEmergencyOtherPurpose(e.target.value)}
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Loan Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount (Max ₱30,000)"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Interest Rate:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">1.75%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Service Fee:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">5%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Upload Supporting Documents:
        </label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setEmergencyDocument(e.target.files[0])}
        />
      </div>
    </>
  );
};

export default EmergencySection;
