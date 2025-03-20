import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { ArrowLeft } from "lucide-react"; // Import Arrow Icon
import logo from "../../assets/logosibbap.png";

const RegularSavingsCalculator = ({ member, onClose }) => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState("");
  const [computation, setComputation] = useState({ daily: 0, monthly: 0, annually: 0 });

  const calculateInterestRate = (amount) => {
    return amount >= 1000 ? 0.005 : 0; // Use 3.2% (0.032) instead of 4% (0.04)
  };
  
  useEffect(() => {
    const numericAmount = parseFloat(amount.replace(/,/g, "") || 0);
    const rate = calculateInterestRate(numericAmount);

    const annualInterest = numericAmount * rate; // 4% annually
    const monthlyInterest = annualInterest / 12;
    const dailyInterest = annualInterest / 365;

    setComputation({
      daily: isNaN(dailyInterest) ? "0.00" : dailyInterest.toFixed(2),
      monthly: isNaN(monthlyInterest) ? "0.00" : monthlyInterest.toFixed(2),
      annually: isNaN(annualInterest) ? "0.00" : annualInterest.toFixed(2),
    });
  }, [amount]);

  return (
    <div className="w-full max-w-md mx-auto mt-2">
      {/* Back Button */}
      <button
        className="flex items-center text-gray-700 hover:text-black mb-4"
        onClick={() => navigate(-1)} // Go back to the previous page
      >
        <ArrowLeft size={20} className="mr-2" /> Back
      </button>

      <div className="flex justify-center mb-3">
        <img src={logo} alt="Sibbap Logo" className="w-32 sm:w-48" />
      </div>

      <h2 className="text-xl font-semibold text-center">Regular Savings Calculator</h2>
      <p className="text-center text-gray-500 text-sm">Save money and earn interest up to</p>
      <p className="text-center text-green-500 text-xl font-bold">0.5% Monthly Interest</p>

      <div className="mt-4 bg-gray-100 p-4 rounded-md text-center">
        <p className="text-gray-600 text-sm">Input Balance to Calculate</p>

        {/* Input Field with Proper Formatting */}
        <input
          type="text"
          value={amount ? `₱${parseFloat(amount.replace(/,/g, "") || 0).toLocaleString()}` : ""}
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            setAmount(rawValue);
          }}
          className="w-full text-center text-4xl font-bold bg-transparent outline-none border-none"
          placeholder="₱0.00"
        />
      </div>

      <div className="mt-4 bg-white rounded-lg shadow-md p-4 rounded-md">
        <h3 className="text-lg font-semibold text-center">Interest Earnings</h3>
        <div className="divide-y divide-gray-200">
          <div className="flex justify-between py-2">
            <span>1 Day:</span>
            <span className="text-green-600 text-base">
              +PHP <span className="font-bold text-green-600 text-xl">{computation.daily}</span>
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>30 Days:</span>
            <span className="text-green-600 text-base">
              +PHP <span className="font-bold  text-green-600 text-xl">{computation.monthly}</span> 
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span>1 Year:</span>
            <span className="text-green-600 text-base">
              +PHP <span className="font-bold  text-green-600 text-xl">{computation.annually}</span> 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegularSavingsCalculator;
