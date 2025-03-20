import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RegularSavings from './RegularSavings'; 
import TimeDeposit from './TimeDeposit'; 
import ShareCapital from './ShareCapital'; 

const Borrowers = () => {
    const [borrowers, setBorrowers] = useState([]);
    const [activeTab, setActiveTab] = useState("RegularSavings");

    useEffect(() => {
        fetchBorrowers();
    }, []);

    const fetchBorrowers = async () => {
        try {
            const response = await axios.get('/api/borrowers');
            setBorrowers(response.data);
        } catch (error) {
            console.error('Error fetching borrowers:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Savings</h2>
            <div className="tabs flex space-x-4 mb-6 p-4 bg-gray-100 shadow-sm">
                <button
                    onClick={() => setActiveTab("RegularSavings")}
                    className={`px-4 py-2 font-medium rounded-lg ${
                        activeTab === "RegularSavings" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Regular Savings
                </button>
                <button
                    onClick={() => setActiveTab("TimeDeposit")}
                    className={`px-4 py-2 font-medium rounded-lg ${
                        activeTab === "TimeDeposit" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Time Deposit
                </button>
                <button
                    onClick={() => setActiveTab("ShareCapital")}
                    className={`px-4 py-2 font-medium rounded-lg ${
                        activeTab === "ShareCapital" ? "bg-blue-500 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Share Capital
                </button>
            </div>

            <div className="content">
                {activeTab === "RegularSavings" && <RegularSavings />}
                {activeTab === "TimeDeposit" && <TimeDeposit />}
                {activeTab === "ShareCapital" && <ShareCapital />}
            </div>

            <h2 className="text-3xl font-bold mt-6 mb-4">Borrower List</h2>
            <ul>
                {borrowers.map((borrower) => (
                    <li key={borrower.id}>{borrower.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Borrowers;
