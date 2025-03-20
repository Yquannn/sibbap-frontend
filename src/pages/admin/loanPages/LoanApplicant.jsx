import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoanApplicant = () => {
  const apiBaseURL = 'http://localhost:3001/api/loan-application/all';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All");
  const [borrowers, setBorrowers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");

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
    } catch (err) {
      setError('Failed to fetch borrowers. Please try again later.');
      console.error('Error fetching borrowers:', err);
    }
  };

  // Filtering logic: filter by loan type, search query, and status.
  const filteredBorrowers = borrowers.filter(borrower => {
    if (!borrower) return false;

    const matchesLoanType = activeTab === "All" ? true : borrower.loan_type === activeTab;

    const firstName = borrower.first_name || "";
    const lastName = borrower.last_name || "";
    const middleName = borrower.middle_name || "";
    const fullName = `${firstName} ${lastName} ${middleName}`.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      (borrower.client_voucher_number &&
        borrower.client_voucher_number.toString().includes(searchQuery)) ||
      (borrower.memberCode &&
        borrower.memberCode.toString().toLowerCase().includes(searchQuery.toLowerCase()));

    const borrowerStatus = borrower.status || "Waiting for Approval";
    const matchesStatus = statusFilter === "All" ? true : borrowerStatus === statusFilter;

    return matchesLoanType && matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      {/* Filter Section */}
      <div className="mb-6 p-6 bg-white shadow-lg rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Loan Type Dropdown */}
          <div>
            <label htmlFor="loanType" className="block text-sm font-medium text-gray-600 mb-1">
              <span className="flex items-center">
                <FaFilter className="mr-1" /> Kinds of Loan
              </span>
            </label>
            <select
              id="loanType"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Loans</option>
              {loanTypes.map((tab) => (
                <option key={tab} value={tab}>
                  {tab.replace(/([A-Z])/g, ' $1').trim()}
                </option>
              ))}
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-600 mb-1">
              <span className="flex items-center">
                <FaSearch className="mr-1" /> Search Applicant
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by name, voucher or code number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-1">
              <span className="flex items-center">
                <FaFilter className="mr-1" /> Status
              </span>
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Waiting for Approval">Waiting for Approval</option>
            </select>
          </div>
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
        Loan Application List for{" "}
        {activeTab === "All" ? "All Loans" : activeTab.replace(/([A-Z])/g, ' $1').trim()}
      </h3>
      <div className="overflow-x-auto" style={{ maxHeight: "65vh" }}>
        <table className="min-w-full table-auto bg-white border border-gray-300 text-sm divide-y divide-gray-200">
          <thead className="sticky top-0 bg-green-200 z-20">
            <tr>
              <th className="px-4 py-2 text-center">Client Voucher Number</th>
              <th className="px-4 py-2 text-center">Code Number</th>
              <th className="px-4 py-2 text-center">Full Name</th>
              <th className="px-4 py-2 text-center">Loan Type</th>
              <th className="px-4 py-2 text-center">Application</th>
              <th className="px-4 py-2 text-center">Loan Amount</th>
              <th className="px-4 py-2 text-center">Interest</th>
              <th className="px-4 py-2 text-center">Terms</th>
              <th className="px-4 py-2 text-center">Application Date</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Remarks</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBorrowers.length > 0 ? (
              filteredBorrowers.map((borrower) => (
                <tr key={borrower.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.client_voucher_number || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.memberCode || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.last_name}, {borrower.first_name} {borrower.middle_name}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.loan_type || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.application || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.loan_amount || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.interest || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700">
                    {borrower.terms || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(borrower.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="inline-block px-2 py-1 rounded-full">
                      {borrower.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-block px-2 py-1 rounded-full font-semibold ${
                        borrower.remarks === "Updated"
                          ? "bg-green-500 text-white"
                          : borrower.remarks === "Mispayment"
                          ? "bg-blue-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {borrower.remarks}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => navigate(`/loan-application/${borrower.loan_application_id}`)}
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                    >
                      View Evaluation
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4 text-gray-600">
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

export default LoanApplicant;
