import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaEye, FaSearch, FaDollarSign, FaPiggyBank } from "react-icons/fa";
import MemberAccountModal from "../../childModal/MemberAccountModal";

// Helper to format numbers with comma separators and two decimals
const formatCurrency = (value) => {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const TimeDeposit = ({ openModal, handleDelete }) => {
  const [timeDeposits, setTimeDeposits] = useState([]); // State to store time deposits
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalType, setModalType] = useState(""); // Modal type (deposit or withdraw)
  const [selectedMember, setSelectedMember] = useState(null); // Selected member for modal actions
  const [filterQuery, setFilterQuery] = useState(""); // State for filtering

  // Open modal with the selected type and member record
  const handleOpenModal = (type, member = null) => {
    setModalType(type);
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType("");
    setSelectedMember(null);
  };

  // Fetch active time deposits
  const fetchTimeDeposits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3001/api/active/");

      if (response.data.length === 0) {
        throw new Error("No depositor for time deposit.");
      }
      setTimeDeposits(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error fetching time deposits."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchTimeDeposits();
  }, [fetchTimeDeposits]);

  // Filtering logic: filter time deposits by search query (matches full name or code number)
  const filteredDeposits = timeDeposits.filter((depositor) => {
    const query = filterQuery.toLowerCase();
    const fullName = `${depositor.firstName} ${depositor.LastName}`.toLowerCase();
    const code = depositor.memberCode ? depositor.memberCode.toLowerCase() : "";
    return query === "" || fullName.includes(query) || code.includes(query);
  });

  return (
    <div className="p-0">
      <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Left: Title */}
          <h4 className="text-xl font-bold">
            Time Deposit Members - {filteredDeposits.length}
          </h4>

          {/* Right: Button and Search Input */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search by name or code number..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>
            <button
              onClick={() => handleOpenModal("deposit")}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
            >
              Open Account
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <MemberAccountModal
        openModal={openModal}
        handleDelete={handleDelete}
        showModal={isModalOpen}
        closeModal={handleCloseModal}
        modalType={modalType} // Pass modalType to the modal
        member={selectedMember} // Pass the selected member to the modal (if needed)
      />

      {/* Loading, Error, and Table */}
      <div className="overflow-y-auto max-h-[60vh] card bg-white shadow-md rounded-lg p-4">
        {loading ? (
          <p className="text-center text-gray-500 p-4">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 p-4">{error}</p>
        ) : (
          <table className="table w-full">
            <thead className="text-center">
              <tr>
                <th className="w-12">
                  <input type="checkbox" className="checkbox" />
                </th>
                {[
                  "Code Number",
                  "Account No.",
                  "Account Type",
                  "Account Holder",
                  "Co-Account Holder",
                  "Deposited Amount",
                  "Term",
                  "Account Status",
                  "Actions",
                ].map((heading) => (
                  <th key={heading} className="py-3 px-4 border-b border-gray-300">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length > 0 ? (
                filteredDeposits.map((depositor, index) => (
                  <tr
                    key={`${depositor.id}-${index}`}
                    className="text-center hover:bg-gray-100 cursor-pointer"
                  >
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    {/* Code Number */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      {depositor.memberCode || "N/A"}
                    </td>
                    {/* Account No. */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      {depositor.accountNo || "N/A"}
                    </td>
                    {/* Account Type */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      Time Deposit
                    </td>
                    {/* Account Holder */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      {depositor.firstName} {depositor.LastName}
                    </td>
                    {/* Co-Account Holder */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      {depositor.coAccountHolder || "N/A"}
                    </td>
                    {/* Deposited Amount */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      ₱{formatCurrency(depositor.amount)}
                    </td>
                    {/* Term */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      {depositor.fixedTerm} Months
                    </td>
                    {/* Account Status */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          (!depositor.remarks || depositor.remarks === "ACTIVE")
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {depositor.remarks}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4 border-b border-gray-300">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleOpenModal("withdraw", depositor)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center"
                        >
                          <FaDollarSign className="mr-1" /> Early withdraw
                        </button>
                        <button
                          onClick={() => handleOpenModal("deposit", depositor)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                        >
                          <FaPiggyBank className="mr-1" /> Roll over
                        </button>
                        <button
                          onClick={() => handleOpenModal("withdraw", depositor)}
                          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 flex items-center"
                        >
                          <FaPiggyBank className="mr-1" /> Withdraw
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-4 text-center">
                    No active time deposits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TimeDeposit;
