import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { ArrowLeft } from "lucide-react"; // Import Arrow Icon
import logo from "../../assets/logosibbap.png"

const TimedepositCalculator = ({ member, onClose }) => {
  const navigate = useNavigate(); // Hook for navigation

  const [amount, setAmount] = useState("");
  const [fixedTerm, setFixedTerm] = useState("");
  const [computation, setComputation] = useState({
    maturityDate: "",
    interest: 0,
    payout: 0,
    interestRate: 0,
  });

  const calculateInterestRate = (amount, termMonths) => {
    if (termMonths === 6) {
      if (amount >= 10000 && amount <= 100000) return 0.0075;
      if (amount > 100000 && amount <= 200000) return 0.01;
      if (amount > 200000 && amount <= 300000) return 0.0175;
      if (amount > 300000 && amount <= 400000) return 0.0225;
      if (amount > 400000) return 0.025;
    } else if (termMonths === 12) {
      if (amount >= 10000 && amount <= 100000) return 0.01;
      if (amount > 100000 && amount <= 200000) return 0.015;
      if (amount > 200000 && amount <= 300000) return 0.02;
      if (amount > 300000) return 0.03;
    }
    return 0;
  };

  useEffect(() => {
    if (amount && fixedTerm) {
      const principal = parseFloat(amount);
      const termMonths = parseInt(fixedTerm, 10);
      const interestRate = calculateInterestRate(principal, termMonths);
      const days = termMonths === 6 ? 181 : 365;
      const interest = principal * interestRate * (days / 365);
      const payout = principal + interest;
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + termMonths);

      setComputation({
        maturityDate: maturityDate.toLocaleDateString(),
        interest: interest.toFixed(2),
        payout: payout.toFixed(2),
        interestRate: interestRate * 100,
      });
    }
  }, [amount, fixedTerm]);

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
  
      <h2 className="text-xl font-semibold text-center">Time Deposit Calculator</h2>
      <p className="text-center text-gray-500 text-sm">Grow your money and with fixed returns!</p>
      
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


      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Fixed Term</label>
        <select
          value={fixedTerm}
          onChange={(e) => setFixedTerm(e.target.value)}
          className="w-full mt-1 p-2 border rounded-md"
        >
          <option value="">Select term</option>
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
        </select>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md rounded-md">
        <h3 className="text-lg font-semibold text-center">Interest Earnings</h3>
        <p className="text-gray-500 text-sm text-center">
          Maturity Date: {computation.maturityDate 
            ? new Date(computation.maturityDate).toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric" 
              }) 
            : "-"}
        </p>
       <div className="divide-y divide-gray-200">
          <div className="mt-2 flex justify-between">
            <span>Interest:</span>
            <span className="text-green-600 text-base">+PHP <span className="font-bold text-green-600 text-xl"> {parseFloat(computation.interest).toLocaleString()}</span></span>     
          </div>
          <div className="mt-2 flex justify-between">
            <span>Interest Rate:</span>
            <span className="font-bold text-green-600 text-xl">{computation.interestRate || "-"}%</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Payout:</span>
            <span className="text-green-600 text-base">+PHP <span  className="font-bold text-green-600 text-xl">{parseFloat(computation.payout).toLocaleString()}</span></span>
          </div>
        </div>
        
        </div>
    </div>
  );
};

export default TimedepositCalculator;
