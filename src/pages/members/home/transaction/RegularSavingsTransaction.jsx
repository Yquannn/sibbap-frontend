import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, CreditCard, Banknote, PiggyBank } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-timezone";

const RegularSavingsTransactionHistory = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = useMemo(() => localStorage.getItem("userEmail"), []);

  const filterMapping = {
    All: "All",
    Deposit: "Deposit",
    Withdrawal: "Withdrawal",
    "Savings Interest": "Savings Interest",
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!email) {
        setError("Email not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member/email/${email}`
        );

        if (response.data && response.data.transactions) {
          setTransactions(response.data.transactions);
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
  }, [email]);

  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter((txn) => txn.transaction_type === filterMapping[filter]);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.transaction_date_time) - new Date(a.transaction_date_time)
  );

  return (
    <div className="max-w-lg mx-auto pt-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white p-3 z-50">
        <button
          className="flex items-center text-gray-700 hover:text-black mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-2xl text-center font-bold">Transaction Details</h1>
          {/* Filter Tabs */}
      <div className="flex justify-center space-x-2 mt-6">
        {Object.keys(filterMapping).map((category) => (
          <button
            key={category}
            className={`px-3 py-1 rounded-lg text-sm transition ${
              filter === category
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

    
      </div>
      <div className="mt-16">
      {/* Transactions List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading transactions...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : sortedTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200 ">
            {sortedTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between py-3 hover:bg-gray-100  cursor-pointer"
                onClick={() =>
                  navigate(`/regular-savings-transaction-info/${txn.regular_savings_transaction_id}`)
                }
              >
                <div className="flex items-center gap-3">
                  {/* Transaction Icon */}
                  {txn.transaction_type === "Deposit" ? (
                    <CreditCard className="text-green-500" size={24} />
                  ) : txn.transaction_type === "Withdrawal" ? (
                    <Banknote className="text-red-500" size={24} />
                  ) : (
                    <PiggyBank className="text-green-500" size={24} />
                  )}

                  {/* Transaction Info */}
                  <div>
                    <p className="font-medium">{txn.transaction_type}</p>
                    <p className="text-sm text-gray-500">
                      {moment
                        .utc(txn.transaction_date_time)
                        .tz("Asia/Manila")
                        .format("MMMM D, YYYY • hh:mm A")}
                    </p>
                  </div>
                </div>

                {/* Transaction Amount */}
                <p
                  className={`font-semibold ${
                    txn.transaction_type === "Withdrawal"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {txn.transaction_type === "Withdrawal" ? "−" : "+"}₱
                  {Math.abs(txn.amount)
                    .toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No transactions found.</p>
        )}
      </div>
      </div>
  );
};

export default RegularSavingsTransactionHistory;
