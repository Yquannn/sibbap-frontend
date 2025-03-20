import React from "react";

const MotorcycleSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  motorcycleLoanAmount,
  setMotorcycleLoanAmount,
  terms,
  setTerms,
  motorcycleComaker,
  setMotorcycleComaker,
  motorcycleCoBorrower,
  setMotorcycleCoBorrower,
  setMotorcycleDocuments,
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
          placeholder="Enter Amount (Max ₱120,000)"
          value={motorcycleLoanAmount}
          onChange={(e) => setMotorcycleLoanAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms:</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
        >
          {Array.from({ length: 36 }, (_, i) => (
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
            value={motorcycleComaker.name}
            onChange={(e) =>
              setMotorcycleComaker({ ...motorcycleComaker, name: e.target.value })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={motorcycleComaker.memberId}
            onChange={(e) =>
              setMotorcycleComaker({ ...motorcycleComaker, memberId: e.target.value })
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
            value={motorcycleCoBorrower.memberId}
            onChange={(e) =>
              setMotorcycleCoBorrower({
                ...motorcycleCoBorrower,
                memberId: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Relationship"
            value={motorcycleCoBorrower.relationship}
            onChange={(e) =>
              setMotorcycleCoBorrower({
                ...motorcycleCoBorrower,
                relationship: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Name"
            value={motorcycleCoBorrower.name}
            onChange={(e) =>
              setMotorcycleCoBorrower({
                ...motorcycleCoBorrower,
                name: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Contact Number"
            value={motorcycleCoBorrower.contactNumber}
            onChange={(e) =>
              setMotorcycleCoBorrower({
                ...motorcycleCoBorrower,
                contactNumber: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Address"
            value={motorcycleCoBorrower.address}
            onChange={(e) =>
              setMotorcycleCoBorrower({
                ...motorcycleCoBorrower,
                address: e.target.value,
              })
            }
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
          onChange={(e) => setMotorcycleDocuments(e.target.files[0])}
        />
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

export default MotorcycleSection;
