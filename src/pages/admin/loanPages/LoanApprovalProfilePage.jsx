import React, { useState, useEffect } from 'react';
import axios from 'axios';
import pic from "./blankPicture.png"; // Fallback placeholder image
import { CheckCircle, Clock, XCircle, Search } from "lucide-react";
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const LoanApprovalProfile = () => {
  const { loan_application_id } = useParams();
  const navigate = useNavigate();

  // State for loan application (which includes member details)
  const [loanApplication, setLoanApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for active tab navigation
  const [activeTab, setActiveTab] = useState("loanApplication");

  // Message/feedback state
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  // Additional state (if needed)
  const [loanSearchTerm, setLoanSearchTerm] = useState("");

  // Helper functions for formatting
  const formatCurrency = (value) => {
    if (!value) return "₱0.00";
    return "₱" + Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Fetch loan application data on mount
  useEffect(() => {
    if (loan_application_id) {
      setLoading(true);
      axios
        .get(`http://localhost:3001/api/loan-application/${loan_application_id}`)
        .then((res) => {
          setLoanApplication(res.data);
          setError(null);
          console.log("Fetched loan application data:", res.data);
        })
        .catch((err) => {
          console.error("Error fetching loan application:", err);
          setError("Failed to fetch loan application.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loan_application_id]);

  // Extract member info from loanApplication (if available)
  const memberData = loanApplication
    ? {
        id: loanApplication.memberId,
        first_name: loanApplication.first_name,
        last_name: loanApplication.last_name,
        middle_name: loanApplication.middle_name,
        memberCode: loanApplication.memberCode,
        occupation_source_of_income: loanApplication.occupation_source_of_income,
        monthly_income: loanApplication.monthly_income,
        date_of_birth: loanApplication.date_of_birth,
        birthplace_province: loanApplication.birthplace_province,
        spouse_name: loanApplication.spouse_name,
        spouse_occupation_source_of_income: loanApplication.spouse_occupation_source_of_income,
        spouse_monthly_income: loanApplication.spouse_monthly_income,
        house_no_street: loanApplication.house_no_street,
        barangay: loanApplication.barangay,
        city: loanApplication.city,
        employer_address: loanApplication.employer_address,
        employer_address2: loanApplication.employer_address2,
        age: loanApplication.age,
        sex: loanApplication.sex,
        civil_status: loanApplication.civil_status,
        number_of_dependents: loanApplication.number_of_dependents,
        id_picture: loanApplication.id_picture,
        share_capital: loanApplication.share_capital,
        amount: loanApplication.amount,
      }
    : null;

  const formattedDOB = memberData
    ? new Date(memberData.date_of_birth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const idPictureUrl =
    memberData && memberData.id_picture
      ? `http://localhost:3001/uploads/${memberData.id_picture}`
      : pic;

  // Define missing variables for member status card and loan applications table
  const searchedLoanApps = loanApplication ? [loanApplication] : [];
  const isGoodOrOnTime = true; // Replace with your real logic as needed
  const goodPayerPieData = {
    labels: ["Paid Off", "Remaining"],
    datasets: [
      {
        data: [80, 20],
      },
    ],
  };
  const pieData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [50, 50],
      },
    ],
  };
  const overallPaidOffLoanCount = 10; // Replace with real data
  const loanApps = loanApplication ? [loanApplication] : [];
  const userDistribution = { activeUsers: 5, totalUsers: 10 }; // Replace with real data

  // Disable action buttons if the loan application is already approved or rejected
  const disableActions =
    loanApplication &&
    ["approved", "rejected"].includes(loanApplication.status.toLowerCase());

  // Handler for dismissing messages
  const handleCloseMessage = () => {
    setShowMessage(false);
    setMessage("");
    setMessageType("");
  };

  // Action handlers (only Approved and Rejected)
  const handleApproved = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/loan-applicant/${loan_application_id}/approve`,
        { status: "Approved" }
      );
      setShowMessage(true);
      setMessage("Loan application marked as approved.");
      setMessageType("success");
      setShowFeedbackInput(true);
    } catch (error) {
      console.error("Error updating loan application:", error);
      setShowMessage(true);
      setMessage("Failed to update loan application status.");
      setMessageType("error");
    }
  };

  const handleRejected = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/loan-applicant/${loan_application_id}/approve`,
        { status: "Rejected" }
      );
      setShowMessage(true);
      setMessage("Loan application marked as rejected.");
      setMessageType("success");
      setShowFeedbackInput(false);
    } catch (error) {
      console.error("Error updating loan application:", error);
      setShowMessage(true);
      setMessage("Failed to update loan application status.");
      setMessageType("error");
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:3001/api/loan-applicant/${loan_application_id}/feedback`,
        { feedback }
      );
      setShowMessage(true);
      setMessage("Feedback submitted successfully.");
      setMessageType("success");
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setShowMessage(true);
      setMessage("Failed to submit feedback.");
      setMessageType("error");
    }
  };

  // Render content
  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">Loan Approval</h2>
        <button onClick={() => navigate(-1)} className="text-red-500 text-3xl">
          &times;
        </button>
      </div>

      {/* Success/Error Message */}
      {showMessage && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
          <button onClick={handleCloseMessage} className="ml-4 text-sm underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Member Info Section */}
      {memberData && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Column: Member Info spanning 2 columns */}
          <div className="col-span-1 md:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile Picture & Name */}
              <div className="md:w-1/4 text-center border-r border-gray-200 pr-4">
                <img
                  src={idPictureUrl}
                  alt="ID Picture"
                  className="w-40 h-40 rounded-full mx-auto object-cover"
                />
                <h3 className="text-3xl font-bold mt-4">
                  {memberData.last_name}, {memberData.first_name} {memberData.middle_name}
                </h3>
              </div>
              {/* Additional Information */}
              <div className="md:w-2/3 pl-4 mt-4 md:mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="border p-2">
                      <strong>Code Number:</strong> {memberData.memberCode}
                    </p>
                    <p className="border p-2">
                      <strong>Occupation Source:</strong> {memberData.occupation_source_of_income}
                    </p>
                    <p className="border p-2">
                      <strong>Monthly Salary:</strong> {memberData.monthly_income}
                    </p>
                    <p className="border p-2">
                      <strong>Date of Birth:</strong> {formattedDOB}
                    </p>
                    <p className="border p-2">
                      <strong>Place of Birth:</strong> {memberData.birthplace_province}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="border p-2">
                      <strong>Age:</strong> {memberData.age}
                    </p>
                    <p className="border p-2">
                      <strong>Gender:</strong> {memberData.sex}
                    </p>
                    <p className="border p-2">
                      <strong>Address:</strong> {memberData.house_no_street} {memberData.barangay}{" "}
                      {memberData.city}
                    </p>
                    <p className="border p-2">
                      <strong>Civil Status:</strong> {memberData.civil_status}
                    </p>
                    <p className="border p-2">
                      <strong>Dependents:</strong> {memberData.number_of_dependents}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="border p-2">
                      <strong>Spouse Name:</strong> {memberData.spouse_name || "N/A"}
                    </p>
                    <p className="border p-2">
                      <strong>Spouse Occupation:</strong> {memberData.spouse_occupation_source_of_income || "N/A"}
                    </p>
                    <p className="border p-2">
                      <strong>Spouse Monthly Income:</strong> {memberData.spouse_monthly_income || "N/A"}
                    </p>
                    <p className="border p-2">
                      <strong>Employer Address:</strong> {memberData.employer_address}
                    </p>
                  </div>
                  {/* Extra Row spanning all columns */}
                  <div className="col-span-1 sm:col-span-3 border p-2">
                    <p className="text-center text-sm text-gray-600">
                      Additional member notes can be displayed here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Member Status Card */}
          <div className="col-span-1 bg-white shadow-md rounded-lg p-4 h-full">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">
                {isGoodOrOnTime ? "Good Payer / On Time" : "Active Users"}
              </div>
              {isGoodOrOnTime && <div className="badge badge-success">Excellent</div>}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {isGoodOrOnTime
                ? "Member demonstrates excellent payment behavior."
                : "User distribution overview"}
            </p>
            <div className="flex flex-col items-center justify-center h-34">
              <Pie
                data={isGoodOrOnTime ? goodPayerPieData : pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <div className="text-center mt-2">
              {isGoodOrOnTime ? (
                <>
                  <div className="text-sm font-bold">
                    {overallPaidOffLoanCount.toLocaleString()} paid off loans
                  </div>
                  <div className="text-xs text-gray-500">
                    of {loanApps.length.toLocaleString()} total loans
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold">
                    {userDistribution.activeUsers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Active</div>
                  <div className="text-xs text-gray-500">
                    / {userDistribution.totalUsers.toLocaleString()} total
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Buttons */}
      <div className="mb-6">
        <div className="flex border-b">
          {["loanApplication", "accountDetails", "existingLoan", "loanDocuments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 font-semibold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "loanApplication"
                ? "Loan Application Details"
                : tab === "accountDetails"
                ? "Account Details"
                : tab === "existingLoan"
                ? "Existing Loan"
                : "Loan Documents"}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "accountDetails" && (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-center mb-4">Accounts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-700 mb-2">
                <strong className="font-bold">Account Number:</strong>{" "}
                {loanApplication ? loanApplication.accountNumber : "N/A"}
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="font-bold">Code Number:</strong>{" "}
                {loanApplication ? loanApplication.memberCode : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-2">
                <strong className="font-bold">Regular Savings:</strong>{" "}
                <span className="px-2 py-1 bg-orange-500 rounded-full text-white">
                  {loanApplication ? loanApplication.amount : "N/A"}
                </span>
              </p>
              <p className="text-gray-700 mb-2">
                <strong className="font-bold">Share Capital:</strong>{" "}
                <span className="px-2 py-1 bg-green-500 rounded-full text-white">
                  {loanApplication ? loanApplication.share_capital : "N/A"}
                </span>
              </p>
            </div>
          </div>
          {showFeedbackInput && (
            <div className="mt-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter remarks feedback..."
              />
              <button
                onClick={handleFeedbackSubmit}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "existingLoan" && (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-4">Existing Loans</h3>
          {loading ? (
            <p className="text-center text-gray-500">Loading existing loans...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : loanApplication && loanApplication.existingLoans && loanApplication.existingLoans.length > 0 ? (
            <div
              className="space-y-4 overflow-y-auto"
              style={{ maxHeight: loanApplication.existingLoans.length > 2 ? "350px" : "auto" }}
            >
              {loanApplication.existingLoans.map((loan) => (
                <div
                  key={loan.loan_application_id}
                  className="grid grid-cols-2 gap-6 p-6 bg-gray-50 shadow-md rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Date of Loan:</span>
                      <span className="font-semibold text-gray-900">
                        {loan?.created_at
                          ? new Date(loan.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "2-digit",
                              year: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Voucher Number:</span>
                      <span className="font-semibold text-gray-900">
                        {loan.client_voucher_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Loan Amount:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(loan.loan_amount)}
                      </span>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Interest:</span>
                      <span className="font-semibold text-gray-900">{loan.interest}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Terms:</span>
                      <span className="font-semibold text-gray-900">{loan.terms || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Balance:</span>
                      <span className="font-semibold text-red-600">
                        {formatCurrency(loan.balance)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No existing loan details.</p>
          )}
        </div>
      )}

      {activeTab === "loanApplication" && (
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
          <div className="card bg-white shadow-md rounded-lg p-4" style={{ maxHeight: "300px" }}>
            <div className="card-title text-lg font-bold mb-2">Loan Applications</div>
            <p className="text-sm text-gray-500 mb-4">Details of loan applications.</p>
            {/* Loan Applications Table */}
            <div className="overflow-x-auto" style={{ maxHeight: "500px" }}>
              <table className="table w-full table-zebra">
                <thead className="bg-green-100">
                  <tr>
                    <th>Voucher</th>
                    <th>Type</th>
                    <th>Application</th>
                    <th>Loan Amt</th>
                    <th>Interest</th>
                    <th>Terms</th>
                    <th>Balance</th>
                    <th>Fee</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Loan Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedLoanApps.map((app) => (
                    <tr key={app.loan_application_id}>
                      <td>{app.client_voucher_number}</td>
                      <td>{app.loan_type}</td>
                      <td>{app.application}</td>
                      <td>{formatCurrency(app.loan_amount)}</td>
                      <td>{app.interest}</td>
                      <td>{app.terms}</td>
                      <td>{formatCurrency(app.balance)}</td>
                      <td>{app.service_fee}</td>
                      <td>{formatDate(app.created_at)}</td>
                      <td>{app.status}</td>
                      <td>{app.loan_status}</td>
                      <td>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={() => navigate("/")}
                        >
                          View
                        </button>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "loanDocuments" && (
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-4">Loan Documents</h3>
          <p className="text-center text-gray-700">This section is under construction.</p>
        </div>
      )}

      {/* Action Buttons: Only Approved and Rejected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <button
          disabled={disableActions}
          onClick={handleApproved}
          className={`px-4 py-2 rounded ${
            disableActions ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Approved
        </button>
        <button
          disabled={disableActions}
          onClick={handleRejected}
          className={`px-4 py-2 rounded ${
            disableActions ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          Rejected
        </button>
      </div>
    </div>
  );
};

export default LoanApprovalProfile;
