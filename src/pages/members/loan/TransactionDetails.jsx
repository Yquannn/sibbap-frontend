// src/components/TransactionDetails.jsx

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function TransactionDetails() {
  const navigate = useNavigate();
  const { billId } = useParams();
  const memberId = sessionStorage.getItem("memberId");

  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the installment (with joined repayment) data from the endpoint.
  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/installment/${billId}`
        );
        // Assuming the endpoint returns an array of records.
        setTransactionData(response.data);
        console.log("Response:", response.data);
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    if (memberId && billId) {
      fetchTransactionData();
    } else {
      setError("Member ID or Bill ID not provided");
      setLoading(false);
    }
  }, [memberId, billId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p>Loading transaction details...</p>
      </div>
    );
  }

  if (error || !transactionData || transactionData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans">
        <p className="text-red-500">{error || "No transaction data"}</p>
      </div>
    );
  }

  // Use the first record from the returned array.
  const record = Array.isArray(transactionData)
    ? transactionData[0]
    : transactionData;

  // Extract fields from the record.
  const totalRepaid = record.amount_paid ? Number(record.amount_paid) : 0;
  const loanAmount = record.amount ? Number(record.amortization) : 0;
  const repaidTime = record.payment_date
    ? new Date(record.payment_date).toLocaleDateString()
    : "N/A";
  const method = record.method || "N/A";
  const status = record.installment_status || "N/A";
  const transactionNumber = record.transaction_number || "N/A";

  return (
    <div className="min-h-screen font-sans">
        <div className="fixed top-0 left-0 right-0 bg-white  p-4 z-50">
          <button
            className="flex items-center text-gray-700 hover:text-black mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>
          <div className="flex flex-col items-center justify-center">
            {/* Header */}
            <h1 className="text-2xl text-center font-bold mb-4">
              Transaction Details
            </h1>
        </div>
        {/* Transaction Summary Card */}
        <div className="bg-white w-full max-w-sm">
          <div className="text-center mb-6">
            <p className="text-3xl font-bold mb-1">
              ₱{totalRepaid.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">Amount Paid</p>
          </div>
          {/* <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Loan Amount</span>
            <span className="font-medium">₱{loanAmount.toFixed(2)}</span>
          </div> */}
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Repaid Time</span>
            <span className="font-medium">{repaidTime}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Method</span>
            <span className="font-medium">{method}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Status</span>
            <span className="font-medium">{status}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction No</span>
            <span className="font-medium text-sm">{transactionNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
