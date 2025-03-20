import React from "react";

const SpecialSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  specialCoMaker,
  setSpecialCoMaker,
  setSpecialDocument,
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
          placeholder="Enter Amount (Min ₱50,000 to Max ₱300,000)"
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
          Co‑Maker:
        </label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={specialCoMaker.memberId}
            onChange={(e) =>
              setSpecialCoMaker({ ...specialCoMaker, memberId: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Name"
            value={specialCoMaker.name}
            onChange={(e) =>
              setSpecialCoMaker({ ...specialCoMaker, name: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Documents:
        </label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setSpecialDocument(e.target.files[0])}
        />
        <p className="text-gray-600 text-sm">Upload Post-dated check</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Interest Rate:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">2.5%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Service Fee:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">3%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Gift Check:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">
          {loanAmount >= 50000 && loanAmount <= 100000
            ? "₱500"
            : loanAmount > 100000
            ? "₱1,000"
            : "N/A"}
        </p>
      </div>
    </>
  );
};

export default SpecialSection;
