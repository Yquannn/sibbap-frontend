import React from "react";

const TravelSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  travelCoMaker,
  setTravelCoMaker,
  setTravelDocument,
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
          <option value="local">Local Travel</option>
          <option value="international">International Travel</option>
        </select>
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
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} Month{i + 1 > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Co‑Maker:</label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={travelCoMaker.memberId}
            onChange={(e) =>
              setTravelCoMaker({ ...travelCoMaker, memberId: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Name"
            value={travelCoMaker.name}
            onChange={(e) =>
              setTravelCoMaker({ ...travelCoMaker, name: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Documents:</label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setTravelDocument(e.target.files[0])}
        />
        <p className="text-gray-600 text-sm">
          Upload Post-dated check if loan is ₱150,000 and above.
        </p>
      </div>
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
        <p className="p-2 border rounded-lg bg-gray-100">5%</p>
      </div>
    </>
  );
};

export default TravelSection;
