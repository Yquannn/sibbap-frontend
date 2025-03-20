import React from "react";

const EducationalSection = ({
  statementOfPurpose,
  setStatementOfPurpose,
  loanAmount,
  setLoanAmount,
  educationalRelative,
  setEducationalRelative,
  setEducationalDocument,
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
        <h4 className="font-semibold text-gray-700">
          Immediate Relative Details:
        </h4>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <select
            className="w-full p-2 border rounded-lg"
            value={educationalRelative.relationship}
            onChange={(e) =>
              setEducationalRelative({
                ...educationalRelative,
                relationship: e.target.value,
              })
            }
          >
            <option value="">Select Relationship</option>
            <option value="Parent">Parent</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Sibling">Sibling</option>
          </select>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Student’s Full Name"
            value={educationalRelative.studentName}
            onChange={(e) =>
              setEducationalRelative({
                ...educationalRelative,
                studentName: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Educational Institution"
            value={educationalRelative.institution}
            onChange={(e) =>
              setEducationalRelative({
                ...educationalRelative,
                institution: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            placeholder="Course"
            value={educationalRelative.course}
            onChange={(e) =>
              setEducationalRelative({
                ...educationalRelative,
                course: e.target.value,
              })
            }
          />
          <select
            className="w-full p-2 border rounded-lg col-span-2"
            value={educationalRelative.yearLevel}
            onChange={(e) =>
              setEducationalRelative({
                ...educationalRelative,
                yearLevel: e.target.value,
              })
            }
          >
            <option value="">Select Year Level</option>
            <option value="Tertiary">College Level</option>
            <option value="Elementary">Elementary Level</option>
            <option value="Secondary">Secondary Level</option>
          </select>
        </div>
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
        <label className="block font-medium text-gray-700">
          Upload Expense Documents (Assessment Form):
        </label>
        <input
          type="file"
          className="w-full p-2 border rounded-lg"
          onChange={(e) => setEducationalDocument(e.target.files[0])}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Terms:</label>
        <p className="p-2 border rounded-lg bg-gray-100">
          {educationalRelative.yearLevel === "Tertiary" ? "5 Months" : "10 Months"}
        </p>
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
        <p className="p-2 border rounded-lg bg-gray-100">5%</p>
      </div>
    </>
  );
};

export default EducationalSection;
