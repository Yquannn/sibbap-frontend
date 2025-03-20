import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LoanDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto">
      {/* Back Button */}
      <button className="flex items-center text-gray-700 hover:text-black mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Loan Details</h2>

      {/* Loan Breakdown */}
      <div className="bg-gray-100 p-5 rounded-lg">
        <div className="grid grid-cols-2 gap-y-2 text-gray-700 text-sm">
          <span className="font-medium">Monthly Interest:</span> <span className="text-right text-green-600 font-semibold">₱1.75</span>
          <span className="font-medium">Loan Amount:</span> <span className="text-right text-green-600 font-semibold">₱0</span>
          <span className="font-medium">Monthly Amortization:</span> <span className="text-right text-green-600 font-semibold">₱450</span>
          <span className="font-medium">Terms:</span> <span className="text-right">1</span>
          <span className="font-medium">Date Release:</span> <span className="text-right font-semibold text-gray-800">N/A</span>
          <span className="font-medium">Service Fee (3%):</span> <span className="text-right text-green-600 font-semibold">₱150</span>
          <span className="font-medium">Additional Savings (1%):</span> <span className="text-right text-green-600 font-semibold">₱50</span>
          <span className="font-medium">Capital Buildup (1%):</span> <span className="text-right text-green-600 font-semibold">₱50</span>
          <span className="font-medium">Gift Check:</span> <span className="text-right text-green-600 font-semibold">₱30</span>
          <span className="font-medium">Insurance:</span> <span className="text-right text-green-600 font-semibold">₱70</span>
          <span className="font-medium">Others/Receivables:</span> <span className="text-right text-green-600 font-semibold">₱40</span>
        </div>
        <hr className="my-3 border-gray-300" />
        <div className="flex justify-between font-semibold text-lg text-gray-900">
          <span>Total Disbursed:</span> <span className="text-green-700">₱4,460</span>
        </div>
      </div>

      {/* Payment Schedule */}
      <h3 className="text-lg font-semibold mt-6 mb-3">Payment Schedule</h3>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-800 text-center">
              <th className="p-2 border">Term</th>
              <th className="p-2 border">Due Date</th>
              <th className="p-2 border">Amortization</th>
              <th className="p-2 border">Principal</th>
              <th className="p-2 border">Interest</th>
              <th className="p-2 border">Savings</th>
              <th className="p-2 border">Penalty</th>
              <th className="p-2 border">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center bg-white hover:bg-gray-100">
              <td className="p-2 border">1</td>
              <td className="p-2 border font-semibold text-gray-900">March 1, 2025</td>
              <td className="p-2 border text-green-600 font-semibold">₱450</td>
              <td className="p-2 border text-green-600 font-semibold">₱400</td>
              <td className="p-2 border text-green-600 font-semibold">₱50</td>
              <td className="p-2 border text-green-600 font-semibold">₱50</td>
              <td className="p-2 border text-gray-700">₱0</td>
              <td className="p-2 border text-green-600 font-semibold">₱4,000</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanDetails;
