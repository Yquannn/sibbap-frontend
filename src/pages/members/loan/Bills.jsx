// src/components/Bills.jsx

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bills = () => {
  const [activeTab, setActiveTab] = useState("unpaid");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const memberId = sessionStorage.getItem("memberId");

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member-loan/${memberId}`
        );
        // Expecting an object with an installments array.
        const installments = response.data.installments || [];

        // Sort installments by due_date ascending.
        const sortedInstallments = installments.sort(
          (a, b) => new Date(a.due_date) - new Date(b.due_date)
        );

        // Mark the earliest unpaid installment as upcoming.
        let upcomingMarked = false;
        const billsData = sortedInstallments.map((inst) => {
          const dueDateObj = new Date(inst.due_date);
          const month = dueDateObj.toLocaleString("en-US", { month: "short" });
          const formattedDueDate = dueDateObj.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          const isUpcoming = !upcomingMarked && inst.status === "Unpaid";
          if (isUpcoming) {
            upcomingMarked = true;
          }
          return {
            id: inst.installment_id,
            month,
            status: inst.status,
            dueDate: formattedDueDate,
            amortization: Number(inst.amortization),
            upcoming: isUpcoming,
          };
        });

        setBills(billsData);
        console.log("Fetched bills:", billsData);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };

    if (memberId) {
      fetchBills();
    } else {
      setError("Member ID not provided");
      setLoading(false);
    }
  }, [memberId]);

  // Filter bills by status.
  const unpaidBills = bills.filter((bill) => bill.status === "Unpaid");
  const paidBills = bills.filter((bill) => bill.status !== "Unpaid");

  if (loading) {
    return (
      <div className="max-w-md mx-auto text-center mt-8 font-sans">
        <p>Loading bills...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center mt-8 font-sans">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Helper to navigate to bill details.
  const handleBillClick = (billId) => {
    navigate(`/bill-details/${billId}`);
  };

  return (
    <div className="max-w-md mx-auto font-sans relative">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white  p-4 z-50">
        <button
          className="flex items-center text-gray-700 hover:text-black mb-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
        <h1 className="text-2xl text-center font-bold mb-2">My Bills</h1>
        {/* Tabs */}
        <div className="flex justify-around border-b border-gray-200">
          <button
            className={`pb-2 transition-colors ${
              activeTab === "unpaid"
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("unpaid")}
          >
            Unpaid
          </button>
          <button
            className={`pb-2 transition-colors ${
              activeTab === "paid"
                ? "border-b-2 border-green-500 text-green-500"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("paid")}
          >
            Paid
          </button>
        </div>
      </div>
      {/* Content Padding to prevent overlap with fixed header */}
      <div className="pt-32">
        {activeTab === "unpaid" && (
          <div>
            {unpaidBills.map((bill) => (
              <div key={bill.id} className="mb-4">
                {bill.upcoming && (
                  <div className="text-sm text-gray-500 mb-1">
                    Upcoming Bill
                  </div>
                )}
                {/* Clickable card */}
                <div
                  className="bg-white rounded shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => handleBillClick(bill.id)}
                >
                  <div>
                    <div className="font-semibold text-lg">{bill.month}</div>
                    <div className="text-sm text-red-500">{bill.status}</div>
                    <div className="text-sm text-gray-400">
                      Due Date {bill.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold">
                      ₱{bill.amortization.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {unpaidBills.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                No unpaid bills found.
              </div>
            )}
          </div>
        )}

        {activeTab === "paid" && (
          <div>
            {paidBills.length > 0 ? (
              paidBills.map((bill) => (
                <div key={bill.id} className="mb-4">
                  {/* Clickable card */}
                  <div
                    className="bg-white rounded shadow p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => handleBillClick(bill.id)}
                  >
                    <div>
                      <div className="font-semibold text-lg">{bill.month}</div>
                      <div className="text-sm text-green-500">{bill.status}</div>
                      <div className="text-sm text-gray-400">
                        Due Date {bill.dueDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">
                        ₱{bill.amortization.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No paid bills yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bills;
