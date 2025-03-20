import React from "react";

const MemorialLotSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  memorialCoBorrower,
  setMemorialCoBorrower,
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
          <option value="memorial">Memorial Lot</option>
          <option value="interment">Interment</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Loan Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount (Based on partner's contract price)"
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
          {Array.from({ length: 60 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Co‑Borrower:
        </label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Borrower Member ID"
            value={memorialCoBorrower.memberId}
            onChange={(e) =>
              setMemorialCoBorrower({ ...memorialCoBorrower, memberId: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Borrower Name"
            value={memorialCoBorrower.name}
            onChange={(e) =>
              setMemorialCoBorrower({ ...memorialCoBorrower, name: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Interest Rate:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">1.25%</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Service Fee:
        </label>
        <p className="p-2 border rounded-lg bg-gray-100">2%</p>
      </div>
    </>
  );
};

export default MemorialLotSection;
