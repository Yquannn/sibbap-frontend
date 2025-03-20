import React, { useState } from 'react';
import axios from 'axios';
import TransactionAuthenticate from './TranscationAuthenticate';
import Success from './Success';

const BASE_URL = 'http://localhost:3001/api'; // Base API URL

const TransactionForm = ({ member, modalType, onClose }) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(parseFloat(member.amount) || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTransaction = async () => {
    const currentAuthorized = sessionStorage.getItem('username') || '';
    const currentUserType = sessionStorage.getItem('usertype');
    const amountValue = parseFloat(amount);

    try {
      setLoading(true);
      setError(null);

      const payload = {
        memberId: member.memberId,
        authorized: currentAuthorized,
        user_type: currentUserType,
        transaction_type: modalType === 'withdraw' ? 'Withdrawal' : 'Deposit',
        amount: modalType === 'withdraw' ? Math.abs(amountValue) : amountValue,
      };

      const endpoint = `${BASE_URL}/${modalType}`;
      const response = await axios.put(endpoint, payload);

      if (response.data.success) {
        let updatedBalance = modalType === 'withdraw' ? balance - amountValue : balance + amountValue;
        if (!isNaN(updatedBalance)) {
          setBalance(updatedBalance);
        }

        setShowSuccess(true); // Show success message
        setAmount('');
      } else {
        alert('Transaction failed. Please try again.');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      setError(error.response?.data?.error || 'An error occurred while processing the transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionClick = () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    if (modalType === 'withdraw' && (balance === 100 || balance - amountValue < 100)) {
      alert('Withdrawal denied: balance must remain at least 100.');
      return;
    }
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    handleTransaction();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {modalType === 'withdraw' ? 'Withdraw' : 'Deposit'} Funds
        </h2>
        <p className="text-center mb-4">
          Current Balance: <span className="font-bold">{balance}</span>
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        {showSuccess && <Success message="Transaction completed successfully!" onClose={() => setShowSuccess(false)} />}
        {!showSuccess && (
          <>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex justify-between space-x-3">
              <button
                onClick={handleTransactionClick}
                disabled={loading}
                className={`w-1/2 py-2 px-4 text-white font-semibold rounded-lg shadow hover:opacity-80 focus:outline-none ${
                  modalType === 'withdraw' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : modalType === 'withdraw' ? 'Withdraw' : 'Deposit'}
              </button>
              <button
                onClick={onClose}
                className="w-1/2 py-2 px-4 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-400 focus:outline-none"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>

      {showAuthModal && (
        <TransactionAuthenticate
          onAuthenticate={() => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
            handleTransaction();
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default TransactionForm;
