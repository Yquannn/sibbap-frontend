import React from "react";

const ReconstructionSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  terms,
  setTerms,
  reconstructionScheduled,
  setReconstructionScheduled,
  reconstructionCoMaker1,
  setReconstructionCoMaker1,
  reconstructionCoMaker2,
  setReconstructionCoMaker2,
  setReconstructionDocument,
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
          placeholder="Enter Amount (₱6,000 to above ₱100,001)"
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
          {loanAmount >= 6000 && loanAmount <= 50000 && (
            <option value="12">12 Months</option>
          )}
          {loanAmount >= 50001 && loanAmount <= 100000 && (
            <option value="24">24 Months</option>
          )}
          {loanAmount >= 100001 && <option value="36">36 Months</option>}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Scheduled Payment:
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={reconstructionScheduled}
          onChange={(e) => setReconstructionScheduled(e.target.value)}
        >
          <option value="">Select Payment Schedule</option>
          <option value="first">
            First Loan (after reconstruction) — Back-to-Back Loan
          </option>
          <option value="second">
            Second Loan (after reconstruction) — Double the capital
          </option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Co‑Maker 1:
        </label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={reconstructionCoMaker1.memberId}
            onChange={(e) =>
              setReconstructionCoMaker1({
                ...reconstructionCoMaker1,
                memberId: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Name"
            value={reconstructionCoMaker1.name}
            onChange={(e) =>
              setReconstructionCoMaker1({
                ...reconstructionCoMaker1,
                name: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">
          Co‑Maker 2:
        </label>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Member ID"
            value={reconstructionCoMaker2.memberId}
            onChange={(e) =>
              setReconstructionCoMaker2({
                ...reconstructionCoMaker2,
                memberId: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Co‑Maker Name"
            value={reconstructionCoMaker2.name}
            onChange={(e) =>
              setReconstructionCoMaker2({
                ...reconstructionCoMaker2,
                name: e.target.value,
              })
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
          onChange={(e) => setReconstructionDocument(e.target.files[0])}
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
        <p className="p-2 border rounded-lg bg-gray-100">3%</p>
      </div>
    </>
  );
};

export default ReconstructionSection;
