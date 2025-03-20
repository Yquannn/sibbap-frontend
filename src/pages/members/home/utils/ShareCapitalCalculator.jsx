import React from "react";
import { X } from "lucide-react"; // Close icon

const ShareCapitalCalculator = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Unavailable!</h2>
        <p className="text-gray-600 mt-2">This feature is not available. Stay tuned!</p>
        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={onClose}
        >
          Okay
        </button>
      </div>
    </div>
  );
};

export default ShareCapitalCalculator;
