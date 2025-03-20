import React, { useState, useEffect } from "react";
import axios from "axios";

// Import all the separated components
import BorrowerInformation from "./components/BorrowerInformation";
import LoanTypeSelector from "./components/LoanTypeSelector";
import FeedsRiceSection from "./components/FeedsRiceSection";
import MarketingSection from "./components/MarketingSection";
import BackToBackSection from "./components/BackToBackSection";
import RegularSection from "./components/RegularSection";
import LivelihoodSection from "./components/LivelihoodSection";
import EducationalSection from "./components/EducationalSection";
import EmergencySection from "./components/EmergencySection";
import QuickCashSection from "./components/QuickCashSection";
import CarSection from "./components/CarSection";
import HousingSection from "./components/HousingSection";
import MotorcycleSection from "./components/MotorcycleSection";
import MemorialLotSection from "./components/MemorialLotSection";
import IntermentLotSection from "./components/IntermentLotSection";
import TravelSection from "./components/TravelSection";
import OfwSection from "./components/OfwSection";
import SavingsSection from "./components/SavingsSection";
import HealthSection from "./components/HealthSection";
import SpecialSection from "./components/SpecialSection";
import ReconstructionSection from "./components/ReconstructionSection";

const LoanApplicationForm = ({ isOpen, setIsOpen, member }) => {
  // Common states
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  // Set default loanType to empty so user must select one first.
  const [loanType, setLoanType] = useState("");
  const [sacks, setSacks] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [statementOfPurpose, setStatementOfPurpose] = useState("");
  const [proofOfBusiness, setProofOfBusiness] = useState(null);
  const [terms, setTerms] = useState(1);
  const [maxSacks, setMaxSacks] = useState(0);

  // Other states used in a few sections
  const [coMakerDetails, setCoMakerDetails] = useState({ name: "", memberId: "" });
  const [backToBackCoBorrower, setBackToBackCoBorrower] = useState({
    memberId: "",
    relationship: "",
    name: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    if (isOpen && member?.memberId) {
      fetchMemberDetails(member.memberId);
    }
  }, [isOpen, member]);

  const fetchMemberDetails = async (memberId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/members/${memberId}`);
      setMemberInfo(response.data);
    } catch (error) {
      console.error("Error fetching member details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Revised getSackLimit function.
  const getSackLimit = (share_capital, loanType) => {
    const capital = parseFloat(share_capital);
    if (isNaN(capital)) return 0;
    
    if (loanType === "feeds") {
      if (capital < 6000) return 0;
      if (capital >= 20000) return 15;
      // Proportional calculation between 6000 and 20000.
      return Math.floor(((capital - 6000) / (20000 - 6000)) * 15);
    } else if (loanType === "rice") {
      if (capital >= 20000) return 30;
      else if (capital >= 6000) return 4;
      else return 2;
    }
    return 0;
  };

  // Update maxSacks whenever the loan type or memberInfo changes.
  useEffect(() => {
    if ((loanType === "rice" || loanType === "feeds") && memberInfo) {
      setMaxSacks(getSackLimit(memberInfo.share_capital, loanType));
    }
  }, [loanType, memberInfo]);

  // Compute variable terms for Back-to-Back & Regular loans.
  const computeVariableTerms = (amount) => {
    const amt = Number(amount);
    if (amt >= 6000 && amt <= 10000) return 6;
    if (amt >= 10001 && amt <= 50000) return 12;
    if (amt >= 50001 && amt <= 100000) return 24;
    if (amt >= 100001) return 36;
    return "";
  };

  // Auto-update terms for some loan types.
  useEffect(() => {
    if (loanType === "backToBack" || loanType === "regular") {
      const computed = computeVariableTerms(loanAmount);
      if (computed !== "") {
        setTerms(computed);
      }
    }
  }, [loanAmount, loanType]);

  const handleSacksChange = (value) => {
    const sacksValue = parseInt(value, 10) || 0;
    if (sacksValue > maxSacks) {
      alert(`You can only loan up to ${maxSacks} sacks based on your Share Capital.`);
      setSacks(maxSacks);
    } else {
      setSacks(sacksValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build the details object based on the selected loan type.
    let details = {};
    if (loanType === "feeds" || loanType === "rice") {
      details = {
        statement_of_purpose: statementOfPurpose,
        sacks: sacks,
        max_sacks: maxSacks,
        proof_of_business: proofOfBusiness,
      };
    } else if (loanType === "marketing") {
      details = {
        statement_of_purpose: statementOfPurpose,
        comaker_name: coMakerDetails.name,
        comaker_member_id: coMakerDetails.memberId,
      };
    } else if (loanType === "backToBack") {
      details = {
        statement_of_purpose: statementOfPurpose,
        coborrower_member_id: backToBackCoBorrower.memberId,
        coborrower_relationship: backToBackCoBorrower.relationship,
        coborrower_name: backToBackCoBorrower.name,
        coborrower_contact: backToBackCoBorrower.contactNumber,
        coborrower_address: backToBackCoBorrower.address,
      };
    }
    // (Additional cases for other loan types as needed.)

    const payload = {
      memberId: member.memberId,
      loan_type: loanType,
      loan_amount: loanAmount,
      terms: terms,
      details: details,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/loan-application", payload);
      console.log("Loan application submitted successfully:", response.data);
      alert("Application submitted successfully!");
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting loan application:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
      <div className="relative max-w-3xl w-full p-6 bg-white rounded-lg shadow-lg overflow-y-auto max-h-screen">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500"
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Loan Application
        </h2>
        <form onSubmit={handleSubmit}>
          {loading ? (
            <div className="flex justify-center items-center my-4">
              <p className="text-center text-gray-500 animate-pulse">
                Fetching member details...
              </p>
            </div>
          ) : (
            memberInfo && <BorrowerInformation memberInfo={memberInfo} member={member} />
          )}

          {/* The loan type selection dropdown */}
          <LoanTypeSelector
            loanType={loanType}
            setLoanType={setLoanType}
            memberInfo={memberInfo}
            statementOfPurpose={statementOfPurpose}
            setMaxSacks={setMaxSacks}
            getSackLimit={getSackLimit}
          />

          {/* Render the loan-type–specific section only if a valid loan type is selected */}
          {loanType && (
            <>
              {["feeds", "rice"].includes(loanType) && (
                <FeedsRiceSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  proofOfBusiness={proofOfBusiness}
                  setProofOfBusiness={setProofOfBusiness}
                  sacks={sacks}
                  handleSacksChange={handleSacksChange}
                  maxSacks={maxSacks}
                />
              )}
              {loanType === "marketing" && (
                <MarketingSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  coMakerDetails={coMakerDetails}
                  setCoMakerDetails={setCoMakerDetails}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "backToBack" && (
                <BackToBackSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  computeVariableTerms={computeVariableTerms}
                  backToBackCoBorrower={backToBackCoBorrower}
                  setBackToBackCoBorrower={setBackToBackCoBorrower}
                />
              )}
              {loanType === "regular" && (
                <RegularSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  computeVariableTerms={computeVariableTerms}
                  coMakerDetails={coMakerDetails}
                  setCoMakerDetails={setCoMakerDetails}
                />
              )}
              {loanType === "livelihood" && (
                <LivelihoodSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  coMakerDetails={coMakerDetails}
                  setCoMakerDetails={setCoMakerDetails}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "educational" && (
                <EducationalSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                />
              )}
              {loanType === "emergency" && (
                <EmergencySection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                />
              )}
              {loanType === "quickCash" && (
                <QuickCashSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "car" && (
                <CarSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  carLoanAmount={loanAmount}
                  setCarLoanAmount={setLoanAmount}
                />
              )}
              {loanType === "housing" && (
                <HousingSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "motorcycle" && (
                <MotorcycleSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  motorcycleLoanAmount={loanAmount}
                  setMotorcycleLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "memorialLot" && (
                <MemorialLotSection loanAmount={loanAmount} setLoanAmount={setLoanAmount} />
              )}
              {loanType === "intermentLot" && (
                <IntermentLotSection loanAmount={loanAmount} setLoanAmount={setLoanAmount} />
              )}
              {loanType === "travel" && (
                <TravelSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "ofw" && (
                <OfwSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                />
              )}
              {loanType === "savings" && (
                <SavingsSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "health" && (
                <HealthSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
              {loanType === "special" && (
                <SpecialSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  coMakerDetails={coMakerDetails}
                  setCoMakerDetails={setCoMakerDetails}
                />
              )}
              {loanType === "reconstruction" && (
                <ReconstructionSection
                  statementOfPurpose={statementOfPurpose}
                  setStatementOfPurpose={setStatementOfPurpose}
                  loanAmount={loanAmount}
                  setLoanAmount={setLoanAmount}
                  terms={terms}
                  setTerms={setTerms}
                />
              )}
            </>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationForm;
