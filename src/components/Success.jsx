import React from 'react';

const Success = ({ type, message, onClose }) => {
  const modalClasses = type === 'success'
    ? 'bg-green-50 border-2 border-white-600'
    : 'bg-red-50 border-2 border-red-600';
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className={`w-full max-w-sm p-6 rounded-lg shadow-lg transform transition-all duration-300 ${modalClasses}`}>
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 flex justify-center items-center rounded-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="text-white w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {type === 'success' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{type === 'success' ? 'Success!' : 'Error!'}</h2>
        <p className="text-gray-600 text-sm mb-4">{message}</p>
        <button 
          onClick={onClose} 
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Success;
