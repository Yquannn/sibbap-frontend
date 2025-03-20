import React, { useState } from "react";
import TimeDeposit from "./savingsPages/timedeposit/TimeDeposit";
import ShareCapital from "./savingsPages/SharedCapital";
import { useNavigate } from "react-router-dom";

const Savings = () => {
  // Default active tab is "TimeDeposit"
  const [activeTab, setActiveTab] = useState("TimeDeposit");
  const navigate = useNavigate();

  // Handler to update active tab and navigate to the corresponding route.
  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="">
      <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
        <button
          onClick={() => handleTabClick("TimeDeposit", '/time-deposit')}
          className={`px-4 py-2 font-medium rounded-lg ${
            activeTab === "TimeDeposit"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Time Deposit
        </button>
        <button
          onClick={() => handleTabClick("ShareCapital", '/share-capital')}
          className={`px-4 py-2 font-medium rounded-lg ${
            activeTab === "ShareCapital"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          Share Capital
        </button>
      </div>

      <div className="content">
        {activeTab === "TimeDeposit" && <TimeDeposit />}
        {activeTab === "ShareCapital" && <ShareCapital />}
      </div>
    </div>
  );
};

export default Savings;
