import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LoanInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Extract the dynamic id from the URL
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);

  const memberId = id || sessionStorage.getItem("memberId");

  // Fetch data from the endpoint using the provided memberId
  useEffect(() => {
    axios
      .get(`http://192.168.254.103:3001/api/member-loan/${memberId}`)
      .then((response) => {
        setLoanData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loan data:", error);
        setLoading(false);
      });
  }, [id, memberId]);

  if (loading) {
    return <div className="max-w-md mx-auto p-4">Loading...</div>;
  }

  if (!loanData) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p>No loan data found.</p>
      </div>
    );
  }

  // Extract the first record from each array if available
  const loanApp =
    loanData.loanApplications && loanData.loanApplications.length > 0
      ? loanData.loanApplications[0]
      : null;
  const feedsDetail =
    loanData.feedsRiceDetails && loanData.feedsRiceDetails.length > 0
      ? loanData.feedsRiceDetails[0]
      : null;
  const personalInfo =
    loanData.loanPersonalInformation && loanData.loanPersonalInformation.length > 0
      ? loanData.loanPersonalInformation[0]
      : null;

  // Calculate totals based on loan application fields (if available)
  const numPeriods = loanApp ? Number(loanApp.terms) : 0;
  const principalAmount = loanApp ? Number(loanApp.loan_amount) : 0;
  const processingFee = loanApp ? Number(loanApp.service_fee) : 0;
  const installmentFee = 0; // Update if applicable
  const totalAmountToPay = principalAmount + processingFee + installmentFee;
  const installmentAmount = numPeriods > 0 ? totalAmountToPay / numPeriods : 0;

  // Use installments from the API if available, otherwise compute them
  const computedInstallments =
    loanData.installments && loanData.installments.length > 0
      ? loanData.installments.map((item) => ({
          id: item.installment_id,
          label: `${item.installment_number}/${numPeriods}`,
          amount: Number(item.amortization),
          dueDate: new Date(item.due_date).toLocaleDateString(),
          status: item.status,
        }))
      : Array.from({ length: numPeriods }, (_, i) => {
          const dueDate = new Date(loanApp.created_at);
          dueDate.setMonth(dueDate.getMonth() + (i + 1));
          return {
            id: i + 1,
            label: `${i + 1}/${numPeriods}`,
            amount: installmentAmount,
            dueDate: dueDate.toLocaleDateString(),
            status: loanApp.status, // fallback status from loanApp if needed
          };
        });

  // Map the API data to the UI structure
  const installmentData = {
    orderAmount: principalAmount,
    processingFee: processingFee,
    installmentFee: installmentFee,
    paidBy: personalInfo
      ? `${personalInfo.first_name} ${personalInfo.last_name}`
      : "",
    periods: numPeriods,
    createdTime: loanApp ? new Date(loanApp.created_at).toLocaleString() : "",
    product: loanApp ? loanApp.loan_type : "",
    loanId: loanApp ? loanApp.client_voucher_number : "",
    orderId: personalInfo ? personalInfo.memberCode : "",
    installments: computedInstallments,
  };

  // Determine if loan type is "Feeds Loan" or "Rice Loan" to show sacks info
  const isFeedsOrRiceLoan =
    installmentData.product.toLowerCase() === "feeds loan" ||
    installmentData.product.toLowerCase() === "rice loan";

  // Helper function for formatting dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="fixed top-0 left-0 right-0 bg-white  p-4 z-50">
               <button
                 className="flex items-center text-gray-700 hover:text-black mb-4"
                 onClick={() => navigate(-1)}
               >
                 <ArrowLeft size={20} className="mr-2" /> Back
               </button>
               <div className="flex flex-col items-center justify-center">
                 {/* Header */}
                 <h1 className="text-2xl text-center font-bold mb-4">
                   Loan Details
                 </h1>
             </div>
      </div>
      {/* Loan Summary (if available) */}
      {loanApp && (
        <>
          <div className="text-3xl font-bold text-gray-800 mb-1 mt-28">
            ₱{principalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-gray-500 mb-6">Loan Amount</div>

          <hr className="my-4" />

          <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
            <div className="text-gray-600">Service Fee</div>
            <div className="text-right">
              ₱{processingFee.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>

            <div className="text-gray-600">Periods</div>
            <div className="text-right">{loanApp.terms}</div>

            <div className="text-gray-600">Created Time</div>
            <div className="text-right">
              {formatDate(loanApp.created_at)}
            </div>

            <div className="text-gray-600">Loan Type</div>
            <div className="text-right">{loanApp.loan_type}</div>

            <div className="text-gray-600">CVN</div>
            <div className="text-right">{loanApp.client_voucher_number}</div>
          </div>

          <hr className="my-4" />
        </>
      )}

      {/* Sacks Section (if applicable) */}
      {isFeedsOrRiceLoan && feedsDetail && (
        <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
          <div className="text-gray-600">Sacks Avail</div>
          <div className="text-right">
            {feedsDetail.sacks} / {feedsDetail.max_sacks}
          </div>
        </div>
      )}

      {/* Installment Breakdown */}
      <div className="border-t pt-4">
        <h2 className="font-semibold mb-3">Installment Details</h2>
        {installmentData.installments.length > 0 ? (
          installmentData.installments.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center justify-between mb-4 text-sm">
                <div>
                  <div className="font-medium">
                    {item.label} - ₱
                    {Number(item.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    Due Date: {item.dueDate}
                  </div>
                </div>
                <div className="text-sm text-red-500">{item.status}</div>
              </div>
              {index !== installmentData.installments.length - 1 && (
                <hr className="border-gray-150" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No installments available.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanInformation;
