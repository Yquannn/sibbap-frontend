import React from "react";

const CarSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  carLoanAmount,
  setCarLoanAmount,
  carVehicleType,
  setCarVehicleType,
  terms,
  setTerms,
  carCoMaker,
  setCarCoMaker,
  carCoBorrower,
  setCarCoBorrower,
  setCarDocuments,
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
          type="text"
          className="w-full p-2 border rounded-lg bg-gray-100"
          value={carLoanAmount}
          onChange={(e) => setCarLoanAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Vehicle Type:
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={carVehicleType}
          onChange={(e) => setCarVehicleType(e.target.value)}
        >
          <option value="">Select Vehicle Type</option>
          <option value="brandNew">
            Brand New Vehicle - Up to 80% of Actual Value
          </option>
          <option value="secondHand">
            Second-Hand Vehicle - Up to 60% of Appraised Value
          </option>
        </select>
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
          Co‑Maker Information:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Name"
            value={carCoMaker.name}
            onChange={(e) => setCarCoMaker({ ...carCoMaker, name: e.target.value })}
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={carCoMaker.memberId}
            onChange={(e) =>
              setCarCoMaker({ ...carCoMaker, memberId: e.target.value })
            }
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
            value={carCoBorrower.memberId}
            onChange={(e) =>
              setCarCoBorrower({ ...carCoBorrower, memberId: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Relationship"
            value={carCoBorrower.relationship}
            onChange={(e) =>
              setCarCoBorrower({ ...carCoBorrower, relationship: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Name"
            value={carCoBorrower.name}
            onChange={(e) =>
              setCarCoBorrower({ ...carCoBorrower, name: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Contact Number"
            value={carCoBorrower.contactNumber}
            onChange={(e) =>
              setCarCoBorrower({ ...carCoBorrower, contactNumber: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Address"
            value={carCoBorrower.address}
            onChange={(e) =>
              setCarCoBorrower({ ...carCoBorrower, address: e.target.value })
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Upload Required Documents:
        </label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setCarDocuments(e.target.files[0])}
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

export default CarSection;
