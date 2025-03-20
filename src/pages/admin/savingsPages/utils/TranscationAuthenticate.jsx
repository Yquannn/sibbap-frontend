import React, { useState, useEffect } from "react";

const LOCK_DURATION = 600000; // 10 minutes in milliseconds

const TransactionAuthenticate = ({ onAuthenticate, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [unlockTime, setUnlockTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // If no password is set in session storage, default to "1234" for testing.
    const storedPass = sessionStorage.getItem("password") || "1234";
    setCurrentPass(storedPass);

    const savedAttempts = parseInt(localStorage.getItem("authAttempts")) || 0;
    setAttempts(savedAttempts);

    const lockExpiration = parseInt(localStorage.getItem("lockExpiration")) || 0;
    if (lockExpiration > Date.now()) {
      setLocked(true);
      setUnlockTime(lockExpiration);
      updateTimeLeft(lockExpiration);
    }
  }, []);

  useEffect(() => {
    if (locked) {
      const timer = setInterval(() => {
        updateTimeLeft(unlockTime);
        if (Date.now() >= unlockTime) {
          resetLock();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [locked, unlockTime]);

  const updateTimeLeft = (lockUntil) => {
    const remaining = Math.max(0, lockUntil - Date.now());
    setTimeLeft(remaining);
  };

  const resetLock = () => {
    setAttempts(0);
    setLocked(false);
    setError("");
    localStorage.removeItem("authAttempts");
    localStorage.removeItem("lockExpiration");
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (locked) {
      setError(`Maximum attempts exceeded. Try again in ${formatTimeLeft()}.`);
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password === currentPass) {
      setError("");
      resetLock();
      if (typeof onAuthenticate === "function") {
        onAuthenticate(password);
      }
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("authAttempts", newAttempts);

      if (newAttempts >= 3) {
        const lockUntil = Date.now() + LOCK_DURATION;
        setLocked(true);
        setUnlockTime(lockUntil);
        localStorage.setItem("lockExpiration", lockUntil);
        updateTimeLeft(lockUntil);
        setError("Maximum attempts exceeded. Try again in 10 minutes.");
      } else {
        setError("Invalid password. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-600 bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Enter Your Password
        </h2>
        {locked && (
          <p className="text-red-600 text-center mb-4">
            Locked. Try again in <strong>{formatTimeLeft()}</strong>.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={locked}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={locked}
              className="w-full px-4 py-2 text-white font-medium bg-green-600 hover:bg-green-700 rounded-md shadow-sm"
            >
              Authenticate
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionAuthenticate;
