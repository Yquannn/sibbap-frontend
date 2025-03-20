import React, { useState, useEffect } from "react";
import axios from "axios";
import { HandCoins, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";

const LoanTransactionHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const memberId = id || sessionStorage.getItem("memberId");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sort transactions by payment_date descending.
  const getSortedTransactions = () => {
    return [...transactions].sort(
      (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
    );
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member-loan/${memberId}`
        );

        let data;
        if (Array.isArray(response.data) && response.data.length > 0) {
          data = response.data[0];
        } else if (response.data) {
          data = response.data;
        } else {
          throw new Error("No loan data found.");
        }

        if (data.repayments && Array.isArray(data.repayments)) {
          setTransactions(data.repayments);
        } else {
          throw new Error("No transactions found.");
        }
      } catch (err) {
        setError(err.message || "Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchTransactions();
    } else {
      setError("Member ID not found.");
    }
  }, [memberId]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="header">
        <button
          className="flex items-center text-gray-700 hover:text-black mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Loan Transaction History</h2>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {getSortedTransactions().length > 0 ? (
            getSortedTransactions().map((txn) => (
                          <div
                            key={txn.repayment_id}
                            className="bg-white rounded-lg p-4 mb-4 shadow flex items-center gap-4"
                          >
                            {/* Repayment Icon */}
                            <HandCoins className="text-blue-500" size={24} />
                            <div className="flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    Repayment
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {new Date(txn.payment_date).toLocaleDateString("en-US", {
                                      month: "long",
                                      day: "2-digit",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>
                                {/* Amount and Transaction Number combined */}
                                  <div
                                    className={`font-semibold ${Number(txn.amount_paid) < 0 ? "text-red-500" : "text-green-500"}`}
                                  >
                                    {Number(txn.amount_paid) < 0 ? "−" : ""}₱
                                    {Math.abs(Number(txn.amount_paid)).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </div>
                                  
                              </div>
                              <div className="flex flex-col justify-between">
                                <div className="flex items-center text-xs text-gray-500 justify-between w-full">
                                  <span>{txn.method}</span>
                                  <span className="text-xs text-gray-400">******{txn.transaction_number.toString().slice(-7)}</span>
                                </div>
                              </div>
              
              
              
                            </div>
                          </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoanTransactionHistory;
