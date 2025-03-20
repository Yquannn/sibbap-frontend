import React from "react";

const LivelihoodSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  coMakerDetails,
  setCoMakerDetails,
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
          <option value="workingCapital">Working Capital</option>
          <option value="additionalCapital">Additional Capital</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Loan Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount (Max ₱100,000)"
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
      {Number(loanAmount) >= 50000 && (
        <div className="mb-4">
          <label className="block font-medium text-gray-700">
            Co‑Maker Details (Required for loans ₱50,000 and above):
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Co‑Maker Name"
              value={coMakerDetails.name}
              onChange={(e) =>
                setCoMakerDetails({ ...coMakerDetails, name: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Co‑Maker Member ID"
              value={coMakerDetails.memberId}
              onChange={(e) =>
                setCoMakerDetails({ ...coMakerDetails, memberId: e.target.value })
              }
            />
          </div>
        </div>
      )}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Interest Rate:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">2%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Service Fee:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">3%</p>
      </div>
    </>
  );
};

export default LivelihoodSection;
