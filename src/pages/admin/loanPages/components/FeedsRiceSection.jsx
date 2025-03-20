import React from "react";

const FeedsRiceSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  proofOfBusiness,
  setProofOfBusiness,
  sacks,
  handleSacksChange,
  maxSacks,
}) => {
  return (
    <>
      <div>
        {/* Three-column grid for main fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Statement of Purpose:
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={statementOfPurpose}
              onChange={(e) => setStatementOfPurpose(e.target.value)}
            >
              <option value="personal">
                Personal (Livestock & Poultry or Consumption)
              </option>
              <option value="business">
                Business (Livestock & Poultry or Consumption)
              </option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Number of Sacks (50kg/Sack):
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              value={sacks}
              onChange={(e) => handleSacksChange(e.target.value)}
            />
            <p className="text-gray-600 text-sm mt-1">
              You can loan up to <strong>{maxSacks}</strong> sacks based on your Share Capital.
            </p>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Terms:
            </label>
            <p className="p-2 border rounded-lg bg-gray-100">30 Days</p>
          </div>
        </div>

        {/* If Statement of Purpose is business, show file input in a full-width row */}
        {statementOfPurpose === "business" && (
          <div className="mt-4">
            <label className="block font-medium text-gray-700 mb-1">
              Proof of Business Registration:
            </label>
            <input
              type="file"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setProofOfBusiness(e.target.files[0])}
            />
          </div>
        )}
      </div>

    </>
  );
};

export default FeedsRiceSection;
