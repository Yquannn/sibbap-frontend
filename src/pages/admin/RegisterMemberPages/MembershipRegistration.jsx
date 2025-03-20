import React, { useState } from "react";
import axios from "axios";
import PersonalInformation from "./PersonalInformation";
import ContactInformation from "./ContactInformation";
import LegalBeneficiaries from "./LegalBeneficiaries";
import InitialContribution from "./InitialContribution";
import Documents from "./Documents";
import MemberPortal from "./MemberPortal";

const Membership = () => {
  // Track the active tab index (step)
  const [activeTab, setActiveTab] = useState(0);

  // Shared state for all multi-step form data
  const [formData, setFormData] = useState({
    personalInfo: {},
    contactInfo: {},
    legalBeneficiaries: {},
    initialContribution: {},
    documents: {},
    mobilePortal: {},
  });

  // Titles for each step (used for display)
  const tabs = [
    "PERSONAL INFORMATION",
    "CONTACT INFORMATION",
    "LEGAL BENEFICIARIES",
    "INITIAL CONTRIBUTION",
    "DOCUMENTS",
    "MOBILE PORTAL",
  ];

  // Navigate back one step
  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  // Navigate forward one step
  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleSave = async () => {
    try {
      // Create a FormData object and flatten the nested formData
      const formDataObj = new FormData();

      // Loop over each section (personalInfo, contactInfo, etc.)
      Object.entries(formData).forEach(([section, sectionData]) => {
        Object.entries(sectionData).forEach(([key, value]) => {
          // If value is a File, append it; otherwise, append a string value.
          if (value instanceof File) {
            formDataObj.append(key, value);
          } else {
            formDataObj.append(key, value !== undefined && value !== null ? value : "");
          }
        });
      });

      const response = await axios.post("http://localhost:3001/api/register-member", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Registration successful", response.data);
      alert(response.data.message || "Member added successfully!");
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage =
        error.response?.data?.message || "Registration error! Please try again later.";
      alert(`Error adding member: ${errorMessage}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white w-full h-full max-w-none rounded-lg p-2">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-green-700">
          MEMBERSHIP REGISTRATION
        </h1>

        {/* Step Tabs */}
        <div className="flex border-b-2 mb-4 overflow-x-auto">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className={`py-4 px-6 text-lg font-bold cursor-pointer border-b-4 transition-all duration-300 ${
                index === activeTab
                  ? "border-green-600 text-green-700"
                  : "border-gray-300 text-gray-600 hover:text-green-700 hover:border-green-500"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mt-4">
          {activeTab === 0 && (
            <PersonalInformation
              handleNext={handleNext}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === 1 && (
            <ContactInformation
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === 2 && (
            <LegalBeneficiaries
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === 3 && (
            <InitialContribution
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === 4 && (
            <Documents
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {activeTab === 5 && (
            <MemberPortal
              handleSave={handleSave}
              handlePrevious={handlePrevious}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Membership;
