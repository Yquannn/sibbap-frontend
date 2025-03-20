import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  Users,
  PhilippinePeso,
  CreditCard,
  Clock,
  Filter,
  SquareUserRound,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminLoanMonitorUI() {
  const { id } = useParams();
  const memberId = id || sessionStorage.getItem("memberId");
  const navigate = useNavigate();

  // Helper function to format numbers with comma separators and two decimals
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Data states
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown filter state: by loan_application_id and by loan status
  const [selectedLoanId, setSelectedLoanId] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Search state for Loan Applications and Repayments
  const [loanSearchTerm, setLoanSearchTerm] = useState("");
  const [repaymentSearchTerm, setRepaymentSearchTerm] = useState("");

  // Placeholders for chart data
  const [statusCounts, setStatusCounts] = useState({});
  const [userDistribution, setUserDistribution] = useState({
    totalUsers: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/member-loan/${memberId}`
        );
        if (!response.data || response.data.length === 0) {
          setError("No loan data found.");
        } else {
          // Use the first record if an array is returned
          const data = Array.isArray(response.data)
            ? response.data[0]
            : response.data;
          setLoanData(data);

          // Build status counts from loanApplications
          const loanApps = data.loanApplications || [];
          const counts = loanApps.reduce((acc, app) => {
            const status = app.status?.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          setStatusCounts(counts);

          // Placeholder user distribution (or update as needed)
          setUserDistribution({
            totalUsers: 821,
            activeUsers: 384280,
          });
        }
      } catch (err) {
        console.error("Error fetching loan data:", err);
        setError("Failed to load loan data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [memberId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-error">{error}</div>;
  }

  if (!loanData) {
    return <div className="p-6 text-center">No data available.</div>;
  }

  // Extract personal information from the loanPersonalInformation array.
  const personalInfo =
    loanData.loanPersonalInformation && loanData.loanPersonalInformation.length > 0
      ? loanData.loanPersonalInformation[0]
      : null;

  // Extract loan applications array
  const loanApps = loanData.loanApplications || [];

  // Compute overall counts (from all data, regardless of filters)
  const overallActiveLoanCount = loanApps.filter(
    (app) =>
      app.loan_status &&
      app.loan_status.toLowerCase() === "active"
  ).length;
  const overallPaidOffLoanCount = loanApps.filter(
    (app) =>
      app.loan_status &&
      app.loan_status.toLowerCase() === "paid off"
  ).length;

  // Determine if the member is a good payer (no active loans & at least one paid-off loan)
  const isGoodPayer =
    overallActiveLoanCount === 0 && overallPaidOffLoanCount > 0;

  // Determine if the member is on time to pay by checking for overdue installments.
  const today = new Date();
  const overdueInstallments = (loanData.installments || []).filter((inst) => {
    return (
      inst.status &&
      inst.status.toLowerCase() === "unpaid" &&
      new Date(inst.due_date) < today
    );
  });
  const isOnTime = overdueInstallments.length === 0;
  const isGoodOrOnTime = isGoodPayer || isOnTime;

  // Prepare pie chart data based on member status.
  const goodPayerPieData = {
    labels: ["Paid Off Loans", "Other Loans"],
    datasets: [
      {
        label: "Loan Payment Status",
        data: [overallPaidOffLoanCount, loanApps.length - overallPaidOffLoanCount],
        backgroundColor: ["#4ade80", "#a5b4fc"],
        hoverOffset: 4,
      },
    ],
  };

  // Default pie chart data for Active Users (used if not good payer or on time)
  const pieData = {
    labels: ["Active Users", "Other Users"],
    datasets: [
      {
        label: "User Distribution",
        data: [userDistribution.activeUsers, userDistribution.totalUsers],
        backgroundColor: ["#4ade80", "#a5b4fc"],
        hoverOffset: 4,
      },
    ],
  };

  // Filter loan applications based on dropdowns:
  let filteredLoanApps = loanApps;
  if (selectedLoanId !== "all") {
    filteredLoanApps = filteredLoanApps.filter(
      (app) => app.loan_application_id.toString() === selectedLoanId
    );
  }
  if (selectedStatus !== "all") {
    filteredLoanApps = filteredLoanApps.filter(
      (app) =>
        app.loan_status &&
        app.loan_status.toLowerCase() === selectedStatus.toLowerCase()
    );
  }

  // Apply search filter on loan applications
  const searchedLoanApps = filteredLoanApps.filter((app) => {
    const search = loanSearchTerm.toLowerCase();
    return (
      app.client_voucher_number?.toLowerCase().includes(search) ||
      app.loan_type?.toLowerCase().includes(search) ||
      app.application?.toLowerCase().includes(search)
    );
  });

  const statTotalLoan = searchedLoanApps
    .reduce((acc, app) => acc + parseFloat(app.loan_amount), 0)
    .toFixed(2);
  const statTotalBalance = searchedLoanApps
    .reduce((acc, app) => acc + parseFloat(app.balance), 0)
    .toFixed(2);

  const activeLoanAmount = searchedLoanApps
    .filter(
      (app) =>
        app.loan_status &&
        app.loan_status.toLowerCase() === "active"
    )
    .reduce((acc, app) => acc + parseFloat(app.loan_amount), 0)
    .toFixed(2);

  const filteredLoanIds = searchedLoanApps.map(
    (app) => app.loan_application_id
  );

  const filteredInstallments = (loanData.installments || []).filter(
    (inst) => filteredLoanIds.includes(inst.loan_application_id)
  );

  const installmentIds = filteredInstallments.map(
    (inst) => inst.installment_id
  );
  const filteredRepayments = (loanData.repayments || []).filter((rep) =>
    installmentIds.includes(rep.installment_id)
  );

  const searchedRepayments = filteredRepayments.filter((rep) => {
    const search = repaymentSearchTerm.toLowerCase();
    return (
      rep.transaction_number?.toLowerCase().includes(search) ||
      rep.method?.toLowerCase().includes(search)
    );
  });

  const barData = {
    labels: ["Approved", "Active", "Rejected", "Paid", "Unpaid"],
    datasets: [
      {
        label: "Loan Status",
        data: [
          statusCounts["approved"] || 0,
          statusCounts["active"] || 0,
          statusCounts["rejected"] || 0,
          statusCounts["paid"] || 0,
          statusCounts["unpaid"] || 0,
        ],
        backgroundColor: [
          "#16a34a",
          "#3b82f6",
          "#dc2626",
          "#2563eb",
          "#eab308",
        ],
      },
    ],
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="stat bg-white shadow-md rounded-lg p-4 flex flex-col justify-between">
          <div className="flex items-center">
            <SquareUserRound size={50} className="text-green-800 mr-2" />
            <div>
              <div className="stat-title text-sm text-gray-500">
                Member Code & Name
              </div>
              <div className="stat-value text-2xl font-bold">
                {personalInfo
                  ? `${personalInfo.memberCode} - ${personalInfo.first_name} ${personalInfo.last_name}`
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>

        <div className="stat bg-white shadow-md rounded-lg p-4 flex items-center">
          <CheckCircle size={50} className="text-blue-500 mr-2" />
          <div>
            <div className="stat-title text-sm text-gray-500">
              Active Loans Count
            </div>
            <div className="stat-value text-2xl font-bold">
              {overallActiveLoanCount.toLocaleString()}
            </div>
            <div className="stat-desc text-gray-400">
              Number of active loans
            </div>
          </div>
        </div>

        <div className="stat bg-white shadow-md rounded-lg p-4 flex items-center">
          <PhilippinePeso size={50} className="text-orange-500 mr-2" />
          <div>
            <div className="stat-title text-sm text-gray-500">
              Total Loan Amount
            </div>
            <div className="stat-value text-2xl font-bold">
              ₱{formatCurrency(statTotalLoan)}
            </div>
            <div className="stat-desc text-gray-400">
              {selectedLoanId === "all" && selectedStatus === "all"
                ? "Cumulative amount"
                : "Filtered amount"}
            </div>
          </div>
        </div>

        <div className="stat bg-white shadow-md rounded-lg p-4 flex items-center">
          <CreditCard size={50} className="text-yellow-500 mr-2" />
          <div>
            <div className="stat-title text-sm text-gray-500">Balance</div>
            <div className="stat-value text-2xl font-bold">
              ₱{formatCurrency(statTotalBalance)}
            </div>
            <div className="stat-desc text-gray-400">
              {selectedLoanId === "all" && selectedStatus === "all"
                ? "Total outstanding"
                : "Filtered outstanding"}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Content: Loan Applications Table and Active Users / Member Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-4">
        <div
          className="card bg-white shadow-md rounded-lg p-4"
          style={{ maxHeight: "300px" }}
        >
          <div className="card-title text-lg font-bold mb-2">
            Loan Applications
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Details of loan applications.
          </p>

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
                    <td>₱{formatCurrency(app.loan_amount)}</td>
                    <td>₱{formatCurrency(app.interest)}</td>
                    <td>{Number(app.terms).toLocaleString()}</td>
                    <td>₱{formatCurrency(app.balance)}</td>
                    <td>₱{formatCurrency(app.service_fee)}</td>
                    <td>{formatDate(app.created_at)}</td>
                    <td>{app.loan_status}</td>
                    <td>
                      <button
                        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-200"
                        onClick={() => navigate(`/apply-loan`)}
                      >
                        Renew
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 ml-2 transition duration-200"
                        onClick={() =>
                          navigate(
                            `/loan-repayment/${app.loan_application_id}?action=view`
                          )
                        }
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

        <div
          className="card bg-white shadow-md rounded-lg p-4"
          style={{ maxHeight: "300px" }}
        >
          <div className="flex items-center justify-between">
            <div className="card-title text-lg font-bold">
              {isGoodOrOnTime ? "Good Payer / On Time" : "Active Users"}
            </div>
            {isGoodOrOnTime && (
              <div className="badge badge-success">Excellent</div>
            )}
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
      {/* Bottom Content: Installments and Repayments Tables */}
      <div className="grid grid-cols-2 gap-4">
        {/* Monthly Amortization Table */}
        <div className="card bg-white shadow-md rounded-lg p-4">
          <div className="card-title text-lg font-bold mb-2">
            Monthly Amortization
          </div>
          <p className="text-sm text-gray-500 mb-4">
            A list of Amortization data.
          </p>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead className="bg-green-100">
                <tr>
                  <th>Per</th>
                  <th>Due</th>
                  <th>Beg.Bal</th>
                  <th>Amort</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Savings</th>
                  <th>Penalty</th>
                  <th>End.Bal</th>
                  <th>Repay</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstallments.map((inst, idx) => (
                  <tr key={idx}>
                    <td>{inst.installment_number}</td>
                    <td>{formatDate(inst.due_date)}</td>
                    <td>₱{formatCurrency(inst.beginning_balance)}</td>
                    <td>₱{formatCurrency(inst.amortization)}</td>
                    <td>₱{formatCurrency(inst.principal)}</td>
                    <td>₱{formatCurrency(inst.interest)}</td>
                    <td>₱{formatCurrency(inst.savings_deposit)}</td>
                    <td>₱{formatCurrency(inst.penalty || 0)}</td>
                    <td>₱{formatCurrency(inst.ending_balance)}</td>
                    <td>
                      {inst.status.toLowerCase() === "unpaid" ? (
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          onClick={() =>
                            navigate(`/loan-repayment/${inst.installment_id}`)
                          }
                        >
                          Repay
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Repayments Table */}
        <div className="card bg-white shadow-md rounded-lg p-4">
          <div className="card-title text-lg font-bold mb-2">
            Repayments Transaction
          </div>
          <p className="text-sm text-gray-500 mb-4">
            A list of repayment data.
          </p>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Repayments..."
              className="input input-bordered input-sm w-full pl-10"
              value={repaymentSearchTerm}
              onChange={(e) => setRepaymentSearchTerm(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full table-zebra">
              <thead className="bg-green-100">
                <tr>
                  <th>Txn #</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date/Time</th>
                  <th>Authorize</th>
                  <th>Method</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {searchedRepayments.map((rep, idx) => (
                  <tr key={idx}>
                    <td>{rep.transaction_number}</td>
                    <td>{rep.transaction_type || "N/A"}</td>
                    <td>₱{formatCurrency(rep.amount_paid)}</td>
                    <td>{formatDate(rep.payment_date)}</td>
                    <td>{rep.authorized || "N/A"}</td>
                    <td>{rep.method}</td>
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
    </div>
  );
}
