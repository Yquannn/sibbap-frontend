import React, { useState, useEffect } from "react";
import axios from "axios";
import { HandCoins, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // Make sure to install moment.js for date formatting

const Transaction = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filterMapping = {
    All: "All",
    Transactions: "Transactions",
  };

  // Function to sort and filter transactions
  const getFilteredTransactions = () => {
    let sortedTransactions = [...transactions].sort((a, b) => new Date(b.transaction_date_time) - new Date(a.transaction_date_time));

    if (filter === "Transactions") {
      return sortedTransactions.filter((txn) =>
        txn.transaction_type === "Deposit" || txn.transaction_type === "Withdrawal"
      );
    }

    return sortedTransactions;
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Replace with your actual API endpoint
        const response = await axios.get("http://192.168.254.103:3001/api/transactions");

        if (response.data && Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          throw new Error("No transactions found.");
        }
      } catch (err) {
        setError(err.message || "Error fetching transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []); // Only runs once when the component mounts

  return (
    <div className="max-w-lg mx-auto">
      <div className="header">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>

        <div className="flex gap-2 mb-4">
          {Object.keys(filterMapping).map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === category ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading transactions...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {getFilteredTransactions().length > 0 ? (
            getFilteredTransactions().map((txn) => (
              <div key={txn.regular_savings_transaction_id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {txn.transaction_type === "Deposit" ? (
                    <HandCoins className="text-green-500" size={24} />
                  ) : txn.transaction_type === "Withdrawal" ? (
                    <HandCoins className="text-red-500" size={24} />
                  ) : (
                    <HandCoins className="text-yellow-500" size={24} />
                  )}
                  <div>
                    <p className="font-medium">{txn.transaction_type}</p>
                    <p className="text-sm text-gray-500">
                      {moment.utc(txn.transaction_date_time).tz("Asia/Manila").format("MMMM D, YYYY • hh:mm")}
                    </p>

                    <div className="flex items-center text-xs text-gray-400">
                      <span className="mr-1">#</span>
                      {txn.transaction_number}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p
                    className={`font-semibold ${txn.transaction_type === "Withdrawal" ? "text-red-500" : "text-green-500"}`}
                  >
                    {txn.transaction_type === "Withdrawal" ? "−" : "+"}₱{Math.abs(parseFloat(txn.amount)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
                  </p>
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

export default Transaction;
