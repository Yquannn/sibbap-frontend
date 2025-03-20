import React from "react";

const BackToBackSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  computeVariableTerms,
  backToBackCoBorrower,
  setBackToBackCoBorrower,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Statement of Purpose:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Purpose"
          value={statementOfPurpose}
          onChange={(e) => setStatementOfPurpose(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Loan Amount:</label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <p className="text-gray-600 text-sm">You can loan up to your paid‑up Share Capital.</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms of Payment:</label>
        <p className="p-2 border rounded-lg bg-gray-100">
          {loanAmount ? `${computeVariableTerms(loanAmount)} Months` : "Auto Generated"}
        </p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Co‑Borrower (Immediate Family):</label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Member ID"
            value={backToBackCoBorrower.memberId}
            onChange={(e) => setBackToBackCoBorrower({ ...backToBackCoBorrower, memberId: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Relationship"
            value={backToBackCoBorrower.relationship}
            onChange={(e) => setBackToBackCoBorrower({ ...backToBackCoBorrower, relationship: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Name"
            value={backToBackCoBorrower.name}
            onChange={(e) => setBackToBackCoBorrower({ ...backToBackCoBorrower, name: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Contact Number"
            value={backToBackCoBorrower.contactNumber}
            onChange={(e) => setBackToBackCoBorrower({ ...backToBackCoBorrower, contactNumber: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Address"
            value={backToBackCoBorrower.address}
            onChange={(e) => setBackToBackCoBorrower({ ...backToBackCoBorrower, address: e.target.value })}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Interest Rate:</label>
        <p className="p-2 border rounded-lg bg-gray-100">2% Auto Generated</p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Service Fee:</label>
        <p className="p-2 border rounded-lg bg-gray-100">3% Auto Generated</p>
      </div>
    </>
  );
};

export default BackToBackSection;
