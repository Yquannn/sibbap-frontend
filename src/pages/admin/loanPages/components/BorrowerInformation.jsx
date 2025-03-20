import React from "react";

const BorrowerInformation = ({ memberInfo, member }) => {
  return (
    <div className="mb-4 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Borrower Information</h3>
      <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
        <p>
          <strong className="text-gray-600">Code Number:</strong> {memberInfo.memberCode}
        </p>
        <p>
          <strong className="text-gray-600">Full name:</strong> {memberInfo.first_name} {memberInfo.middle_name} {memberInfo.last_name}
        </p>
        <p>
          <strong className="text-gray-600">Share Capital:</strong>{" "}
          <span className="text-green-600 font-bold">₱{memberInfo.share_capital}</span>
        </p>
        <p>
          <strong className="text-gray-600">Tax Identification Number:</strong> {memberInfo.tin_number}
        </p>
        <p>
          <strong className="text-gray-600">Civil Status:</strong> {memberInfo.civil_status}
        </p>
        <p>
          <strong className="text-gray-600">Sex:</strong> {memberInfo.sex}
        </p>
        <p>
          <strong className="text-gray-600">Date of birth:</strong>{" "}
          {new Date(member.date_of_birth).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p>
          <strong className="text-gray-600">Age:</strong> {memberInfo.age}
        </p>
        <p>
          <strong className="text-gray-600">Occupation Source of Income:</strong> {memberInfo.occupation_source_of_income}
        </p>
        <p>
          <strong className="text-gray-600">Contact:</strong> {memberInfo.contact_number}
        </p>
        <p>
          <strong className="text-gray-600">Address:</strong> {memberInfo.house_no_street} {memberInfo.barangay} {memberInfo.city}
        </p>
      </div>
    </div>
  );
};

export default BorrowerInformation;
