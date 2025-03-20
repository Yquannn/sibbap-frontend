import React, { useState, useEffect, cloneElement } from 'react';
import { 
  HiOutlineHome, 
  HiOutlineUserGroup, 
  HiBriefcase, 
  HiOutlineDocumentText, 
  HiOutlineChartBar, 
  HiOutlineCog, 
  HiCurrencyDollar,
  HiOutlineBell, 
  HiOutlineLogout, 
  HiOutlineChevronDown, 
  HiOutlineChevronUp, 
  HiOutlineLockClosed,
  HiCheckCircle,
} from 'react-icons/hi';
import { HiOutlineBanknotes } from "react-icons/hi2";
import { IoTimerSharp } from "react-icons/io5";
import { FaShareFromSquare } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";

import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../partials/logosibbap.png';

const SideBar = () => {
  const [loanDropdown, setLoanDropdown] = useState(false);
  const [savingsDropdown, setSavingsDropdown] = useState(false);
  const [userType, setUserType] = useState('');
  const [activePath, setActivePath] = useState(""); // Track active menu item
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve userType from session storage
    const storedUserType = sessionStorage.getItem('usertype');
    const allowedAdminRoles = ["Teller", "Loan Manager", "Treasurer", "General Manager", "System Admin"];
    
    if (!storedUserType || !allowedAdminRoles.includes(storedUserType)) {
      navigate("/authorize");
    } else {
      setUserType(storedUserType);
      // Initialize activePath if not already set.
      if (!activePath) setActivePath(location.pathname);
    }
  }, [navigate, location.pathname, activePath]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const isSystemAdmin = userType === "System Admin";

  // Allowed modules based on userType
  const allowed = {
    dashboard: true,
    members: isSystemAdmin,
    savings: isSystemAdmin || userType === "Teller",
    loan: isSystemAdmin || (userType === "Loan Manager" || userType === "Treasurer"),
    fileMaintenance: isSystemAdmin,
    report: isSystemAdmin || userType === "General Manager",
    users: isSystemAdmin,
    announcement: isSystemAdmin,
    maintenance: isSystemAdmin,
    logout: true,
  };

  const loanSubAllowed = {
    borrower: isSystemAdmin || userType === "Loan Manager",
    "loan-application": isSystemAdmin || userType === "Loan Manager",
    "loan-applicant": isSystemAdmin || userType === "Loan Manager",
    "loan-approval": isSystemAdmin || userType === "Treasurer",
  };

  // Helper function to render a menu item with active styling.
  const renderItem = (allowedFlag, to, icon, label, onClick = null) => {
    const isActive = activePath === to;
    const baseClasses = "flex items-center w-full p-2 rounded transition-colors";
    const activeClasses = isActive
      ? "bg-green-500 text-white"
      : "text-gray-600 hover:text-green-500 hover:bg-gray-200";
      
    const iconElement = icon 
      ? cloneElement(icon, { className: `${isActive ? 'text-white' : 'text-gray-700'} mr-2` })
      : null;
      
    const handleClick = (e) => {
      if (onClick) onClick(e);
      setActivePath(to);
    };

    if (allowedFlag) {
      return (
        <Link 
          to={to} 
          onClick={handleClick} 
          className={`${baseClasses} ${activeClasses}`}
        >
          {iconElement}
          <span>{label}</span>
        </Link>
      );
    } else {
      return (
        <div className="flex items-center w-full p-2 rounded bg-gray-200 cursor-not-allowed">
          {icon && cloneElement(icon, { className: "text-gray-500 mr-2" })}
          <span className="text-gray-500">{label}</span>
          <HiOutlineLockClosed className="text-gray-500 ml-auto" />
        </div>
      );
    }
  };

  return (
    <div className="w-56 h-screen flex flex-col mr-4">
      {/* Logo Container */}
      <div className="p-4 bg-white rounded shadow mb-4 flex items-center justify-center">
        <img 
          src={logo} 
          alt="sibbap logo" 
          className="w-12 h-auto mr-2" 
        />
        <h1 className="font-bold text-base text-gray-800">Sibbap Cooperative</h1>
      </div>

      {/* Sidebar Menu Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-white rounded shadow">
        <ul className="space-y-2">
          <li>
            {renderItem(allowed.dashboard, "/dashboard", <HiOutlineHome />, "Dashboard")}
          </li>
          <li>
            {renderItem(allowed.members, "/members", <HiOutlineUserGroup />, "Members")}
          </li>
          {/* Savings Dropdown */}
          <li 
            className="flex items-center w-full p-2 rounded hover:bg-gray-200 cursor-pointer transition-colors"
            onClick={() => setSavingsDropdown(!savingsDropdown)}
          >
            {cloneElement(<HiOutlineBanknotes />, { className: "mr-2 text-gray-700" })}
            <span className="flex-grow text-gray-700">Savings</span>
            {savingsDropdown 
              ? <HiOutlineChevronUp className="text-gray-700" /> 
              : <HiOutlineChevronDown className="text-gray-700" />}
          </li>
          {savingsDropdown && (
            <ul className="ml-6 space-y-1">
              <li>
                {renderItem(allowed.savings, "/regular-savings", <HiCurrencyDollar />, "Regular Savings")}
              </li>
              <li>
                {renderItem(allowed.savings, "/time-deposit", <IoTimerSharp />, "Time Deposit")}
              </li>
              <li>
                {renderItem(allowed.savings, "/share-capital", <FaShareFromSquare />, "Share Capital")}
              </li>
            </ul>
          )}
          {allowed.loan ? (
            <>
              <li 
                className="flex items-center w-full p-2 rounded hover:bg-gray-200 cursor-pointer transition-colors"
                onClick={() => setLoanDropdown(!loanDropdown)}
              >
                {cloneElement(<HiBriefcase />, { className: "mr-2 text-gray-700" })}
                <span className="flex-grow text-gray-700">Loan</span>
                {loanDropdown 
                  ? <HiOutlineChevronUp className="text-gray-700" /> 
                  : <HiOutlineChevronDown className="text-gray-700" />}
              </li>
              {loanDropdown && (
                <ul className="ml-6 space-y-1">
                  <li>
                    {renderItem(loanSubAllowed["borrower"], "/borrower", <HiOutlineUserGroup />, "Borrowers")}
                  </li>
                  <li>
                    {renderItem(loanSubAllowed["loan-application"], "/loan-application", <HiOutlineDocumentText />, "Loan Application")}
                  </li>
                  <li>
                    {renderItem(loanSubAllowed["loan-applicant"], "/loan-applicant", <IoPeople />, "Loan Applicant")}
                  </li>
                  <li>
                    {renderItem(loanSubAllowed["loan-approval"], "/loan-approval", <HiCheckCircle />, "Loan Approval")}
                  </li>
                </ul>
              )}
            </>
          ) : (
            <li className="flex items-center w-full p-2 rounded bg-gray-200 cursor-not-allowed">
              {cloneElement(<HiBriefcase />, { className: "mr-2 text-gray-500" })}
              <span className="text-gray-500">Loan</span>
              <HiOutlineLockClosed className="text-gray-500 ml-auto" />
            </li>
          )}
          <li>
            {renderItem(allowed.fileMaintenance, "/file-maintenance", <HiOutlineDocumentText />, "File Maintenance")}
          </li>
          <li>
            {renderItem(allowed.report, "/report", <HiOutlineChartBar />, "Report")}
          </li>
          <li>
            {renderItem(allowed.users, "/users", <HiOutlineUserGroup />, "Users")}
          </li>
          <li>
            {renderItem(allowed.announcement, "/announcement", <HiOutlineBell />, "Announcement")}
          </li>
          <li>
            {renderItem(allowed.maintenance, "/maintenance", <HiOutlineCog />, "Maintenance")}
          </li>
          <li>
            <div
              onClick={handleLogout}
              className="flex items-center w-full text-gray-600 hover:text-green-500 p-2 rounded hover:bg-green-200 transition-colors cursor-pointer"
            >
              <HiOutlineLogout className="mr-2 text-gray-700" />
              <span>Log out</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
