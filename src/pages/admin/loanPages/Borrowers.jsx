import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaFilter, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Borrowers = () => {
  const apiBaseURL = 'http://localhost:3001/api/borrowers'; // test API to get all applicants in loan
  const navigate = useNavigate();

  const [borrowers, setBorrowers] = useState([]);
  const [activeTab, setActiveTab] = useState("All"); // Default to "All" loans
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState(""); // State for handling error messages

  // List of loan types available for filtering
  const loanTypes = [
    "Feeds Loan", "Rice Loan", "Marketing Loan", "Back-to-Back Loan",
    "Regular Loan", "Livelihood Assistance Loan", "Educational Loan",
    "Emergency Loan", "Quick Cash Loan", "Car Loan", "Housing Loan",
    "Motorcycle Loan", "Memorial Lot Loan", "Travel Loan",
    "OFW Assistance Loan", "Savings Loan", "Health Insurance Loan",
    "Special Loan", "Reconstruction Loan"
  ];

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const response = await axios.get(apiBaseURL);
      // Sort borrowers by application date (created_at) in descending order (newest first)
      const sortedBorrowers = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setBorrowers(sortedBorrowers);
      console.log("Fetched Borrowers:", sortedBorrowers);
    } catch (error) {
      setError('Failed to fetch borrowers. Please try again later.');
      console.error('Error fetching borrowers:', error);
    }
  };

  // Filter borrowers based on the selected loan type, search query, and status filter.
  const filteredBorrowers = borrowers.filter(borrower => {
    const matchesLoanType = activeTab === "All" ? true : borrower.loanType === activeTab;

    // Create a full name string (case-insensitive)
    const fullName = `${borrower.first_name} ${borrower.last_name} ${borrower.middle_name}`.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      (borrower.clientVoucherNumber &&
        borrower.clientVoucherNumber.toString().includes(searchQuery));

    // Assume borrower.remarks holds the status (Approved, Pending, Rejected, etc.)
    const matchesStatus = statusFilter === "All"
      ? true
      : borrower.remarks && borrower.remarks.toLowerCase() === statusFilter.toLowerCase();

    return matchesLoanType && matchesSearch && matchesStatus;
  });

  return (
    <div className="">
      {/* Filter Section */}
      <div className="mb-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Loan Type Filter */}
          <div className="flex flex-col">
            <label htmlFor="loanType" className="block text-sm font-medium text-gray-600 mb-1">
              <span className="flex items-center">
                <FaFilter className="mr-1" /> Kinds of Loan
              </span>
            </label>
            <select
              id="loanType"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="All">All Loans</option>
              {loanTypes.map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div>

          {/* Search Borrowers Filter */}
          <div className="flex flex-col">
            <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">
              <span className="flex items-center">
                <FaSearch className="mr-1" /> Search Borrowers
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by name or voucher number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* (Optional) Status Filter can be added here */}
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Borrower Table */}
      <h3 className="text-2xl font-semibold mb-4">
        Borrower List for {activeTab === "All" ? "All Loans" : activeTab}
      </h3>
      <div className="overflow-x-auto max-h-[60vh] card bg-white shadow-md rounded-lg p-4">
        <table className="table w-full">
          <thead className="text-center">
            <tr>
              {[
                "Client Voucher Number",
                "Code Number",
                "Full Name",
                "Loan Type",
                "Application",
                "Loan Amount",
                "Interest",
                "Terms",
                "Application Date",
                "Balance",
                "Status",
                "Actions"
              ].map((heading) => (
                <th key={heading} className="py-3 px-4 border-b border-gray-300">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.length > 0 ? (
              filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="text-center hover:bg-gray-100 cursor-pointer">
                  <td className="py-3 px-4 border-b border-gray-300">
                    {borrower.client_voucher_number || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {borrower.memberCode || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {borrower.last_name}, {borrower.first_name} {borrower.middle_name}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {borrower.loan_type || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {borrower.application || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {borrower.loan_amount || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {borrower.interest || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {borrower.terms || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    {new Date(borrower.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    {borrower.balance || 0}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300 text-center">
                    <span
                      className={`px-2 py-1 rounded-full font-semibold ${
                        (!borrower.status || borrower.status === "Approved")
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {borrower.status || "Approved"}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-300">
                    <div className="flex justify-center space-x-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                        onClick={() => navigate(`/borrower-loan-information/${borrower.memberId}`)}
                      >
                        View Loan
                      </button>
                      {/* Uncomment below for repayment action if needed */}
                      {/*
                      <button
                        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
                        onClick={() => navigate(`/repayment/${borrower.id}`)}
                      >
                        <FaDollarSign className="mr-1" /> Repayment
                      </button>
                      */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="py-4 text-center text-gray-600">
                  No borrowers available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Borrowers;
