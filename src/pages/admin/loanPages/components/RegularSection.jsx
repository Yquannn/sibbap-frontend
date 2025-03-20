import React from "react";

const RegularSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  computeVariableTerms,
  coMakerDetails,
  setCoMakerDetails,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Statement of Purpose:
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Purpose"
          value={statementOfPurpose}
          onChange={(e) => setStatementOfPurpose(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Loan Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <p className="text-gray-600 text-sm">
          Based on CI/BI Report, you can loan double to triple your Share Capital.
        </p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Terms of Payment:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">
          {loanAmount ? `${computeVariableTerms(loanAmount)} Months` : "Auto Generated"}
        </p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Co‑Maker Information:
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
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Interest Rate:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">2% Auto Generated</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Service Fee:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">3% Auto Generated</p>
      </div>
    </>
  );
};

export default RegularSection;
