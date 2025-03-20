import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FaMoneyCheckAlt, FaPiggyBank, FaUsers, FaHandHoldingUsd } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  // Updated dummy data for top stats with icons for Loans, Savings, Members, and Lending
  const stats = [
    { label: 'Loans', value: '25', growth: '+5%', icon: <FaMoneyCheckAlt size={24} className="text-blue-500" /> },
    { label: 'Savings', value: '1,200,000', growth: '+12%', icon: <FaPiggyBank size={24} className="text-green-500" /> },
    { label: 'Members', value: '350', growth: '+8%', icon: <FaUsers size={24} className="text-purple-500" /> },
    { label: 'Lending', value: '20', growth: '+10%', icon: <FaHandHoldingUsd size={24} className="text-yellow-500" /> },
  ];

  // Dummy data for line chart representing Monthly Savings Contributions
  const lineChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Savings Contributions',
        data: [200, 400, 600, 800, 1000, 1200],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.2,
      },
    ],
  };

  // Dummy data for pie chart representing transaction types
  const pieChartData = {
    labels: ['Deposits', 'Withdrawals', 'Loan Applications', 'Repayments'],
    datasets: [
      {
        label: 'Transactions',
        data: [500, 200, 100, 50],
        backgroundColor: [
          '#6366F1', // Indigo
          '#F59E0B', // Amber
          '#10B981', // Emerald
          '#EF4444', // Red
        ],
      },
    ],
  };

  // Dummy data for upcoming events in a financial context
  const upcomingEvents = [
    {
      date: 'Sep 15, 2025',
      event: 'Monthly Members Meeting',
    },
    {
      date: 'Sep 25, 2025',
      event: 'Loan Repayment Deadline',
    },
    {
      date: 'Oct 05, 2025',
      event: 'Financial Literacy Workshop',
    },
  ];

  // Dummy data for recent transactions
  const recentTransactions = [
    { id: '#T001', transaction: 'Savings Deposit', member: 'Alice Johnson', amount: '$500.00', status: 'Completed' },
    { id: '#T002', transaction: 'Loan Application', member: 'Bob Smith', amount: '$5,000.00', status: 'Pending' },
    { id: '#T003', transaction: 'Loan Repayment', member: 'Charlie Brown', amount: '$300.00', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Main Content */}
      <main className="w-full">
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          {stats.map((item, idx) => (
            <div key={idx} className="rounded-lg bg-white p-4 shadow flex items-center">
              <div className="p-2 bg-gray-100 rounded mr-4">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">{item.label}</div>
                <div className="mt-1 text-xl font-bold text-gray-800">{item.value}</div>
                <div className={`mt-1 text-sm ${item.growth.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                  {item.growth} from last month
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grid for other sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-4">
            {/* Upcoming Events */}
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Upcoming Events</h2>
              <ul className="space-y-2">
                {upcomingEvents.map((event, i) => (
                  <li key={i} className="flex items-center justify-between border-b py-2 last:border-b-0">
                    <span className="text-gray-600">{event.event}</span>
                    <span className="text-sm text-gray-400">{event.date}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monthly Loan Disbursement Summary */}
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Monthly Loan Disbursement</h2>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">₱750,000</div>
                <div className="text-sm text-gray-500">Total disbursed this month</div>
              </div>
              <Line
                data={{
                  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                  datasets: [
                    {
                      label: 'Disbursement',
                      data: [150000, 200000, 180000, 220000],
                      borderColor: 'rgba(99,102,241,1)',
                      backgroundColor: 'rgba(99,102,241,0.2)',
                    },
                  ],
                }}
                height={80}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { x: { display: false }, y: { display: false } },
                }}
              />
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Monthly Savings Contributions</h2>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            </div>

            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Recent Transactions</h2>
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-2 text-left font-medium text-gray-500">Transaction ID</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500">Transaction Type</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500">Member</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500">Amount</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="whitespace-nowrap px-2 py-2">{txn.id}</td>
                      <td className="whitespace-nowrap px-2 py-2">{txn.transaction}</td>
                      <td className="whitespace-nowrap px-2 py-2">{txn.member}</td>
                      <td className="whitespace-nowrap px-2 py-2">{txn.amount}</td>
                      <td className="whitespace-nowrap px-2 py-2">
                        <span
                          className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                            txn.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : txn.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Transactions Overview</h2>
              <Pie
                data={pieChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
