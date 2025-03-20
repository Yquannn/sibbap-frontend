import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoanTypeSelector from "./components/LoanTypeSelector";
import FeedsRiceSection from "./components/FeedsRiceSection";
import axios from "axios";

const LoanInformation = ({
  handleNext,
  handlePrevious,
  formData,
  setFormData,
  fetchedData,
}) => {
  const navigate = useNavigate();

  // Default objects for fields that are not fetched.
  const defaultContact = {
    house_no_street: "",
    street: "",
    barangay: "",
    city: "",
    province: "",
    contact_number: "",
  };

  const defaultLoanDetails = {
    applicationType: "",
    loanType: "",
    statementOfPurpose: "",
    loanTerms: "",
    interest: "",
    serviceFee: "",
    additionalSavingsDeposit: "",
    shareCapitalBuildUp: "",
    insurance: "",
    giftCertificate: "",
    proofOfBusiness: "",
    sacks: 0,
    loanAmount: "",
  };

  // The memberInfo will hold the personal information fetched from the API.
  const contactInfo = formData.contactInfo || defaultContact;
  const loanInfo = formData.loanInfo || defaultLoanDetails;
  const memberInfo = formData.memberInfo || {};

  // Auto-load memberId from localStorage if not present in state.
  useEffect(() => {
    if (!memberInfo.memberId) {
      const storedMemberId = localStorage.getItem("memberId");
      if (storedMemberId) {
        setFormData((prevData) => ({
          ...prevData,
          memberInfo: {
            ...prevData.memberInfo,
            memberId: storedMemberId,
          },
        }));
      }
    }
  }, [memberInfo, setFormData]);

  // Only update memberInfo with fetchedData, including memberId.
  useEffect(() => {
    if (fetchedData) {
      setFormData((prevData) => ({
        ...prevData,
        memberInfo: {
          ...prevData.memberInfo,
          memberId: fetchedData.memberId || prevData.memberInfo.memberId || "",
          memberCode: fetchedData.memberCode || "",
          last_name: fetchedData.last_name || "",
          first_name: fetchedData.first_name || "",
          middle_name: fetchedData.middle_name || "",
          date_of_birth: fetchedData.date_of_birth || "",
          birthplace_province: fetchedData.birthplace_province || "",
          age: fetchedData.age || "",
          civil_status: fetchedData.civil_status || "",
          sex: fetchedData.sex || "",
          number_of_dependents: fetchedData.number_of_dependents || "",
          spouse_name: fetchedData.spouse_name || "",
          spouse_occupation_source_of_income:
            fetchedData.spouse_occupation_source_of_income || "",
          occupation_source_of_income: fetchedData.occupation_source_of_income || "",
          monthly_income: fetchedData.monthly_income || "",
          employer_address: fetchedData.employer_address || "",
          employer_address2: fetchedData.employer_address2 || "",
          share_capital: fetchedData.share_capital || "",
        },
      }));
    }
  }, [fetchedData, setFormData]);

  // State for maximum sacks.
  const [maxSacks, setMaxSacks] = useState(0);

  // Revised getSackLimit function.
  const getSackLimit = (share_capital, loanType) => {
    const capital = parseFloat(share_capital);
    if (isNaN(capital)) return 0;

    if (loanType === "feeds") {
      if (capital < 6000) return 0;
      if (capital >= 20000) return 15;
      return Math.floor(((capital - 6000) / (20000 - 6000)) * 15);
    } else if (loanType === "rice") {
      if (capital >= 20000) return 30;
      else if (capital >= 6000) return 4;
      else return 2;
    }
    return 0;
  };

  // Update maxSacks when loan type or share capital changes.
  useEffect(() => {
    const shareCapital = memberInfo.share_capital;
    if ((loanInfo.loanType === "rice" || loanInfo.loanType === "feeds") && shareCapital) {
      setMaxSacks(getSackLimit(shareCapital, loanInfo.loanType));
    }
  }, [loanInfo.loanType, memberInfo]);

  // Modal state to show success message.
  const [modalVisible, setModalVisible] = useState(false);

  // Transform formData to match the expected payload.
  const transformFormData = () => {
    const baseLoanAmount = Number(loanInfo.loanAmount) || 0;
    const sacks = Number(loanInfo.sacks) || 1; // default to 1 if sacks is zero or not provided
    // Multiply loan amount by sacks if loan type is feeds or rice.
    const finalLoanAmount =
      (loanInfo.loanType === "feeds" || loanInfo.loanType === "rice")
        ? baseLoanAmount * sacks
        : baseLoanAmount;

    return {
      memberId: String(memberInfo.memberId),
      loan_type:
        loanInfo.loanType === "feeds"
          ? "Feeds Loan"
          : loanInfo.loanType === "rice"
          ? "Rice Loan"
          : loanInfo.loanType,
      application: loanInfo.applicationType,
      loan_amount: finalLoanAmount,
      interest: Number(loanInfo.interest),
      terms: Number(loanInfo.loanTerms),
      balance:  finalLoanAmount,
      service_fee: Number(loanInfo.serviceFee),
      details: {
        statement_of_purpose: loanInfo.statementOfPurpose,
        sacks: Number(loanInfo.sacks),
        max_sacks: Number(maxSacks),
        proof_of_business: loanInfo.proofOfBusiness,
      },
      personalInfo: {
        memberCode: memberInfo.memberCode || "",
        last_name: memberInfo.last_name || "",
        first_name: memberInfo.first_name || "",
        middle_name: memberInfo.middle_name || "",
        date_of_birth: memberInfo.date_of_birth,
        birthplace_province: memberInfo.birthplace_province || "",
        age: memberInfo.age ? Number(memberInfo.age) : 0,
        civil_status: memberInfo.civil_status || "",
        sex: memberInfo.sex || "",
        number_of_dependents: memberInfo.number_of_dependents
          ? Number(memberInfo.number_of_dependents)
          : 0,
        spouse_name: memberInfo.spouse_name || "",
        spouse_occupation_source_of_income:
          memberInfo.spouse_occupation_source_of_income || "",
        occupation_source_of_income:
          memberInfo.occupation_source_of_income || "",
        monthly_income: memberInfo.monthly_income
          ? Number(memberInfo.monthly_income)
          : 0,
        employer_address: memberInfo.employer_address || "",
        employer_address2: memberInfo.employer_address2 || "",
        share_capital: memberInfo.share_capital || "",
      },
    };
  };

  // Handler for loan detail changes.
  const handleLoanChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      loanInfo: {
        ...prevData.loanInfo,
        [name]: value,
      },
    }));
  };

  // Handler for updating Member ID.
  const handleMemberIdChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      memberInfo: {
        ...prevData.memberInfo,
        memberId: value,
      },
    }));
  };

  // Setter for loanType.
  const setLoanType = (val) => {
    setFormData((prevData) => ({
      ...prevData,
      loanInfo: {
        ...prevData.loanInfo,
        loanType: val,
      },
    }));
  };

  // Setter for statementOfPurpose.
  const setStatementOfPurpose = (val) => {
    setFormData((prevData) => ({
      ...prevData,
      loanInfo: {
        ...prevData.loanInfo,
        statementOfPurpose: val,
      },
    }));
  };

  // Setter for proofOfBusiness.
  const setProofOfBusiness = (val) => {
    setFormData((prevData) => ({
      ...prevData,
      loanInfo: {
        ...prevData.loanInfo,
        proofOfBusiness: val,
      },
    }));
  };

  // Handler for sacks change.
  const handleSacksChange = (val) => {
    setFormData((prevData) => ({
      ...prevData,
      loanInfo: {
        ...prevData.loanInfo,
        sacks: val,
      },
    }));
  };

  const handleSave = async () => {
    // Validate required fields.
    if (!memberInfo.memberId) {
      alert("Member ID is required. Please enter your Member ID.");
      return;
    }
    if (!loanInfo.loanAmount || !loanInfo.interest || !loanInfo.loanTerms) {
      alert("Please fill in the required loan amount, interest, and terms.");
      return;
    }
    if (!memberInfo.first_name || !memberInfo.last_name || !memberInfo.date_of_birth) {
      alert("Please fill in your personal information (first name, last name, date of birth).");
      return;
    }

    const payload = transformFormData();
    console.log("Payload to be sent:", payload);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/loan-application",
        payload
      );
      console.log("Loan application submitted successfully:", response.data);
      // Show modal on successful submission.
      setModalVisible(true);
    } catch (error) {
      console.error("Error submitting loan application:", error);
      alert("Error submitting application. Please try again later.");
    }
  };

  // Modal state to show success message.

  // Function to handle closing the modal.
  const closeModal = () => {
    setModalVisible(false);
    // Clear form data if needed; adjust structure as needed.
    setFormData({
      personalInfo: {},
      contactInfo: {},
      loanInfo: {},
      legalBeneficiaries: {},
      initialContribution: {},
      documents: {},
      mobilePortal: {},
    });
    // Navigate to the Loan Applicant page (adjust the path as needed).
    navigate("/loan-application");
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white w-full p-4">
        <h2 className="text-2xl font-bold text-green-600 my-4">
          LOAN APPLICATION DETAILS
        </h2>
        {/* Three-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Application Type
            </label>
            <select
              name="applicationType"
              className="border p-3 rounded-lg w-full"
              value={loanInfo.applicationType}
              onChange={handleLoanChange}
            >
              <option value="">Select Application Type</option>
              <option value="New">New</option>
              <option value="Renewal">Renewal</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Loan Type
            </label>
            <LoanTypeSelector
              loanType={loanInfo.loanType}
              setLoanType={setLoanType}
              memberInfo={memberInfo}
              statementOfPurpose={loanInfo.statementOfPurpose}
              setMaxSacks={setMaxSacks}
              getSackLimit={getSackLimit}
            />
          </div>
          {/* Statement of Purpose spanning all columns */}
          <div className="md:col-span-3">
            <label className="block font-medium text-gray-700 mb-1">
              Statement of Purpose
            </label>
            <textarea
              name="statementOfPurpose"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter statement of purpose"
              value={loanInfo.statementOfPurpose}
              onChange={handleLoanChange}
              rows="2"
            ></textarea>
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Loan Terms
            </label>
            <input
              type="text"
              name="loanTerms"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter loan terms"
              value={loanInfo.loanTerms}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Interest (%)
            </label>
            <input
              type="number"
              step="0.01"
              name="interest"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter interest rate"
              value={loanInfo.interest}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Service Fee
            </label>
            <input
              type="number"
              step="0.01"
              name="serviceFee"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter service fee"
              value={loanInfo.serviceFee}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Additional Savings Deposit (1%)
            </label>
            <input
              type="number"
              step="0.01"
              name="additionalSavingsDeposit"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter additional savings deposit"
              value={loanInfo.additionalSavingsDeposit}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Sharecapital Build Up (1%)
            </label>
            <input
              type="number"
              step="0.01"
              name="shareCapitalBuildUp"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter sharecapital build up"
              value={loanInfo.shareCapitalBuildUp}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Loan Amount
            </label>
            <input
              type="number"
              name="loanAmount"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter loan amount"
              value={loanInfo.loanAmount}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Insurance
            </label>
            <input
              type="number"
              name="insurance"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter insurance"
              value={loanInfo.insurance}
              onChange={handleLoanChange}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Gift Certificate
            </label>
            <input
              type="text"
              name="giftCertificate"
              className="border p-3 rounded-lg w-full"
              placeholder="Enter gift certificate code"
              value={loanInfo.giftCertificate}
              onChange={handleLoanChange}
            />
          </div>
        </div>

        {/* Render Feeds/Rice section if the loan type is feeds or rice */}
        {(loanInfo.loanType === "feeds" || loanInfo.loanType === "rice") && (
          <div className="mt-4">
            <FeedsRiceSection
              statementOfPurpose={loanInfo.statementOfPurpose}
              setStatementOfPurpose={setStatementOfPurpose}
              proofOfBusiness={loanInfo.proofOfBusiness}
              setProofOfBusiness={setProofOfBusiness}
              sacks={loanInfo.sacks}
              handleSacksChange={handleSacksChange}
              maxSacks={maxSacks}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-red-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-800 transition-all"
            onClick={handlePrevious}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Previous
          </button>
          {(loanInfo.loanType === "rice" || loanInfo.loanType === "feeds") ? (
            <button
              className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
              onClick={handleSave}
              type="button"
            >
              <span className="text-2xl">&#187;&#187;</span> Submit Application
            </button>
          ) : (
            <button
              className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
              onClick={handleNext}
              type="button"
            >
              <span className="text-2xl">&#187;&#187;</span> Next
            </button>
          )}
        </div>
      </div>
      {/* Modal to inform user of successful application */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Success</h3>
            <p>Member has been successfully applied!</p>
            <button
              className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanInformation;
