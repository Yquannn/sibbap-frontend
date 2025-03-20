import React from 'react';
import { FaCog, FaQuestionCircle } from 'react-icons/fa';

const UserHeader = ({ name, userType, notifications }) => {
  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  // Function to generate a random pastel color
  const getRandomColor = () => {
    const pastelColors = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF"];
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  return (
    <div className="p-4 mb-4 flex justify-between items-center bg-white rounded shadow">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div 
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 font-bold text-xl"
          style={{ backgroundColor: getRandomColor() }}
        >
          {name ? getInitials(name) : '?'}
        </div>
        <div>
          <h2 className="font-bold text-lg text-gray-800">Welcome, {name}!</h2>
          <p className="text-sm text-gray-500 flex items-center">
            {userType}
            <span className="ml-2 flex items-center text-green-500">
              <svg className="w-2 h-2 fill-current mr-1" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Online
            </span>
          </p>
        </div>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative text-gray-600 hover:text-gray-800">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M15 17h5l-1.403-2.807A2 2 0 0118 12.382V8a6 6 0 10-12 0v4.382a2 2 0 01-.597 1.411L4 17h5m6 0a3 3 0 11-6 0m6 0H9"
            />
          </svg>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {notifications}
            </span>
          )}
        </button>
        {/* Settings */}
        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
          <FaCog className="w-6 h-6" />
          <span className="hidden md:inline text-sm">Settings</span>
        </button>
        {/* Help */}
        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
          <FaQuestionCircle className="w-6 h-6" />
          <span className="hidden md:inline text-sm">Help</span>
        </button>
      </div>
    </div>
  );
};

export default UserHeader;
