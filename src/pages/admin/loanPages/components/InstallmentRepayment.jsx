// InstallmentRepayment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CreditCard, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import SuccessComponent from "./SuccessModal";
import TransactionAuthenticate from "../../savingsPages/utils/TranscationAuthenticate";

const InstallmentRepayment = () => {
  const { id } = useParams(); // installmentId from URL
  const [amountToPay, setAmountToPay] = useState(null);
  const [method, setMethod] = useState("Cash");
  const [authorized, setAuthorized] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetchingAmount, setFetchingAmount] = useState(true);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Fetch the "amount to pay" for the given installment.
  useEffect(() => {
    const fetchAmountToPay = async () => {
      try {
        const response = await axios.get(
          `http://192.168.254.103:3001/api/installment/${id}`
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          setAmountToPay(response.data[0].amortization);
        } else {
          setAmountToPay(0);
        }
      } catch (error) {
        console.error("Error fetching amount to pay:", error);
      } finally {
        setFetchingAmount(false);
      }
    };

    fetchAmountToPay();
  }, [id]);

  // Function that processes repayment after successful authentication.
  const processRepayment = async () => {
    setLoading(true);
    setMessage("");
    // Retrieve the authorized username from session storage before sending the request
    const currentAuthorized = sessionStorage.getItem("username");
    setAuthorized(currentAuthorized);

    try {
      await axios.post(`http://192.168.254.103:3001/api/installment/${id}/repay`, {
        amount_paid: parseFloat(amountToPay),
        method,
        authorized: currentAuthorized,
      });
      setMessage("Repayment successful!");
      setShowModal(true); // Show success modal
      setMethod("Cash");
    } catch (error) {
      console.error("Error making repayment:", error);
      setMessage("Failed to process repayment.");
    } finally {
      setLoading(false);
    }
  };

  // When the user clicks the "Submit Payment" button, show the authentication modal.
  const handleRepayClick = () => {
    setShowAuth(true);
  };

  // Callback when authentication succeeds.
  const handleAuthentication = (password) => {
    // Optionally, you can validate the password before proceeding.
    processRepayment();
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        <CreditCard size={20} /> Installment Repayment
      </h2>

      {/* Display Amount To Pay */}
      <div className="mt-4">
        <label className="block text-sm text-gray-600">Amount To Pay</label>
        {fetchingAmount ? (
          <div className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-700">
            Loading...
          </div>
        ) : (
          <div className="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-700">
            ₱
            {Number(amountToPay).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="mt-4">
        <label className="block text-sm text-gray-600">Payment Method</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full mt-1 p-2 border rounded-lg"
        >
          <option value="Cash">Cash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Online Payment">Online Payment</option>
        </select>
      </div>

      <button
        onClick={handleRepayClick}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : (
          <>
            <CheckCircle size={18} />
            Submit Payment
          </>
        )}
      </button>

      {/* Success Modal */}
      {showModal && (
        <SuccessComponent
          message="Repayment successful!"
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Transaction Authentication Modal */}
      {showAuth && (
        <TransactionAuthenticate
          onAuthenticate={handleAuthentication}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
};

export default InstallmentRepayment;
