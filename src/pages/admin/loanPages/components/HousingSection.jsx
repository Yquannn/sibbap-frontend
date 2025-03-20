import React from "react";

const HousingSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  housingCoMaker,
  setHousingCoMaker,
  housingCoBorrower,
  setHousingCoBorrower,
  setHousingDocuments,
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
          <option value="houseAndLot">House and Lot</option>
          <option value="lotLoan">Lot Loan</option>
          <option value="housingLoan">Housing Loan</option>
          <option value="renovation">Renovation Loan</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Loan Amount:
        </label>
        <input
          type="number"
          className="w-full p-2 border rounded-lg"
          placeholder="Enter Amount (Max depends on loan type)"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <p className="text-gray-600">
          House and Lot: up to ₱1,500,000 | Lot Loan: up to ₱1,200,000 | Housing Loan: up to ₱1,000,000 | Renovation Loan: up to ₱500,000
        </p>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        >
          {Array.from({ length: 84 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
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
            value={housingCoMaker.name}
            onChange={(e) => setHousingCoMaker({ ...housingCoMaker, name: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={housingCoMaker.memberId}
            onChange={(e) => setHousingCoMaker({ ...housingCoMaker, memberId: e.target.value })}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Co‑Borrower (Immediate Family):
        </label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Member ID"
            value={housingCoBorrower.memberId}
            onChange={(e) => setHousingCoBorrower({ ...housingCoBorrower, memberId: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Relationship"
            value={housingCoBorrower.relationship}
            onChange={(e) => setHousingCoBorrower({ ...housingCoBorrower, relationship: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Name"
            value={housingCoBorrower.name}
            onChange={(e) => setHousingCoBorrower({ ...housingCoBorrower, name: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Contact Number"
            value={housingCoBorrower.contactNumber}
            onChange={(e) => setHousingCoBorrower({ ...housingCoBorrower, contactNumber: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Address"
            value={housingCoBorrower.address}
            onChange={(e) => setHousingCoBorrower({ ...housingCoBorrower, address: e.target.value })}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Upload Documents:
        </label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setHousingDocuments(e.target.files[0])}
        />
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
        <p className="p-2 border rounded-lg bg-gray-100">1.2%</p>
      </div>
    </>
  );
};

export default HousingSection;
