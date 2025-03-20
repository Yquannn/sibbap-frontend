// src/components/MemberLoanTracker.jsx

import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Clock, XCircle, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { memberId } from "../home/MemberDashboard";

const MemberLoanTracker = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch loans from backend for the given memberId
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member-loan-application/${memberId}`
        );
        setLoans(response.data);
        console.log("Loans:", response.data);
      } catch (err) {
        console.error("Error fetching loans:", err);
        setError("Failed to fetch loans.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Map backend status to display status.
  const mapStatus = (status) => {
    if (status === "Waiting for Approval" || status === "Waiting for evaluation") {
      return "Pending";
    }
    if (status === "Failed") {
      return "Rejected";
    }
    return status;
  };

  // Return appropriate color classes based on display status.
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  // Return the icon based on display status.
  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="text-green-600" size={20} />;
      case "Pending":
        return <Clock className="text-yellow-600" size={20} />;
      case "Rejected":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  // Filter loans based on selected filter using mapped status.
  const filteredLoans = loans.filter((loan) => {
    const displayStatus = mapStatus(loan.status);
    if (filter === "All") return true;
    return displayStatus === filter;
  });

  return (
    <div className="max-w-xl mx-auto relative font-sans">
    <div className="fixed top-0 left-0 right-0 bg-white p-4 z-50">
      <button
        className="flex items-center text-gray-700 hover:text-black mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>
      <div className="flex flex-col items-center justify-center">
        {/* Header */}
        <h1 className="text-2xl text-center font-bold mb-4">
          Loan Application Tracker
        </h1>
        {/* Tabs */}
        <div className="flex justify-around border-t border-gray-200 pt-2 w-full">
          {["All", "Approved", "Pending", "Rejected"].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
      {/* Main Content with top margin to account for header height */}
      <div className="pt-36">
        {/* Loading and Error States */}
        {loading && <p className="text-center text-gray-500">Loading loans...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Loans List */}
        <div className="divide-y divide-gray-200 mb-14">
          {filteredLoans.map((loan) => {
            const displayStatus = mapStatus(loan.status);
            return (
              <div
                key={loan.loan_application_id}
                className="grid grid-cols-2 gap-4 py-4 cursor-pointer transition-colors"
                onClick={() =>
                  navigate(`/member-loan-details/${loan.loan_application_id}`)
                }
              >
                {/* Top Row: Date (left) & Voucher Number (right) */}
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(loan.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex justify-end">
                  <p className="text-xs text-gray-800">
                    {loan.client_voucher_number || "N/A"}
                  </p>
                </div>

                {/* Bottom Row: Loan type & amount (left) & Status (right) */}
                <div>
                  <p className="font-semibold text-gray-800">{loan.loan_type}</p>
                  <p className="text-gray-700 font-medium">
                    ₱{parseFloat(loan.loan_amount).toLocaleString()}
                  </p>
                  {displayStatus === "Rejected" && loan.remarks && (
                    <p className="text-xs text-red-600">Remarks: {loan.remarks}</p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-3">
                  {getStatusIcon(displayStatus)}
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      displayStatus
                    )}`}
                  >
                    {displayStatus}
                  </span>
                  <ChevronRight size={30} className="text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {filteredLoans.length === 0 && !loading && (
          <p className="mt-6 text-center text-gray-500">
            No loans found for the selected filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default MemberLoanTracker;
