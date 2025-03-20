import React, { useState } from 'react';

const LoanCalculator = () => {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [tradeInValue, setTradeInValue] = useState('');
  const [creditScore, setCreditScore] = useState('Rebuilding (0-600)');
  const [interestRate, setInterestRate] = useState(10);
  const [downPayment, setDownPayment] = useState('');
  const [loanTerm, setLoanTerm] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  // Helper function to determine the interest rate based on the selected credit score.
  const getInterestRateFromCreditScore = (score) => {
    switch (score) {
      case 'Rebuilding (0-600)':
        return 10;
      case 'Fair (601-660)':
        return 8;
      case 'Good (661-780)':
        return 6;
      case 'Excellent (781-850)':
        return 4;
      default:
        return 10;
    }
  };

  // When the credit score changes, update both the creditScore and interestRate.
  const handleCreditScoreChange = (e) => {
    const selectedScore = e.target.value;
    setCreditScore(selectedScore);
    setInterestRate(getInterestRateFromCreditScore(selectedScore));
  };

  // Calculate the monthly payment using the amortization formula:
  // Monthly Payment = P * [r(1+r)^n] / [(1+r)^n - 1]
  const calculateLoan = () => {
    // Convert input values to numbers; if empty, default to 0.
    const vp = Number(vehiclePrice) || 0;
    const tiv = Number(tradeInValue) || 0;
    const dp = Number(downPayment) || 0;
    const lt = Number(loanTerm) || 0;

    const loanAmount = vp - tiv - dp;
    if (loanAmount <= 0 || lt <= 0) {
      setMonthlyPayment(0);
      return;
    }
    // Convert the annual interest rate to a monthly decimal rate.
    const monthlyRate = interestRate / 100 / 12;
    const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -lt));
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center mb-4 text-green-600">
        AUTO LOAN CALCULATOR
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Vehicle Price ($)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Trade-in Value ($)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter a trade-in amount"
            value={tradeInValue}
            onChange={(e) => setTradeInValue(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Credit Score</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={creditScore}
            onChange={handleCreditScoreChange}
          >
            <option>Rebuilding (0-600)</option>
            <option>Fair (601-660)</option>
            <option>Good (661-780)</option>
            <option>Excellent (781-850)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Interest Rate (%)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block font-medium">Down Payment ($)</label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Loan Term (Months)</label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
          >
            <option value={12}>12 Months</option>
            <option value={24}>24 Months</option>
            <option value={36}>36 Months</option>
            <option value={48}>48 Months</option>
            <option value={60}>60 Months</option>
          </select>
        </div>

        <button
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
          onClick={calculateLoan}
        >
          Calculate
        </button>
      </div>

      {monthlyPayment !== null && (
        <div className="mt-6 p-4 border border-orange-500 rounded-lg text-center">
          <p className="text-gray-600">Estimated Monthly Payment</p>
          <p className="text-2xl font-bold">${monthlyPayment}</p>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
