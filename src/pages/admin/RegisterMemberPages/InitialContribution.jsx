import React from "react";

const InitialContribution = ({
  handleNext,
  handlePrevious,
  formData,
  setFormData,
}) => {
  // Default structure for initial contribution data using snake_case keys
  const defaultInitialContribution = {
    share_capital: "",
    membership_fee: "",
    identification_card_fee: "",
    kalinga_fund_fee: "",
    initial_savings: "",
  };

  // Merge parent's data with default values to ensure all keys exist
  const initialContribution = {
    ...defaultInitialContribution,
    ...formData.initialContribution,
  };

  // Handler to update parent's state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      initialContribution: {
        ...initialContribution,
        [name]: value,
      },
    }));
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="bg-white w-full h-full max-w-none rounded-lg p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-4">
          INITIAL CONTRIBUTION
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label>Share capital contribution amount:</label>
            <input
              type="number"
              name="share_capital"
              className="border p-2 rounded-lg w-full"
              placeholder="Share capital contribution amount"
              value={initialContribution.share_capital}
              onChange={handleChange}
            />
            <label>Membership fee:</label>
            <input
              type="number"
              name="membership_fee"
              className="border p-2 rounded-lg w-full"
              placeholder="Membership fee"
              value={initialContribution.membership_fee}
              onChange={handleChange}
            />
            <label>Identification Card fee:</label>
            <input
              type="number"
              name="identification_card_fee"
              className="border p-2 rounded-lg w-full"
              placeholder="Identification Card fee"
              value={initialContribution.identification_card_fee}
              onChange={handleChange}
            />
            <label>Kalinga fund fee:</label>
            <input
              type="number"
              name="kalinga_fund_fee"
              className="border p-2 rounded-lg w-full"
              placeholder="Kalinga fund fee"
              value={initialContribution.kalinga_fund_fee}
              onChange={handleChange}
            />
            <label>Initial savings:</label>
            <input
              type="number"
              name="initial_savings"
              className="border p-2 rounded-lg w-full"
              placeholder="Initial savings"
              value={initialContribution.initial_savings}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-red-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-red-800 transition-all mr-4"
            onClick={handlePrevious}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Previous
          </button>
          <button
            className="bg-green-700 text-white text-lg px-8 py-3 rounded-lg flex items-center gap-3 shadow-md hover:bg-green-800 transition-all"
            onClick={handleNext}
            type="button"
          >
            <span className="text-2xl">&#187;&#187;</span> Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InitialContribution;
