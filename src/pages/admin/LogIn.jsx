import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logosibbap.png';
import Unauthorized from '../Unauthorize';

const LogIn = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);
  const navigate = useNavigate();

  // Redirect when redirectPath is set
  useEffect(() => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  }, [redirectPath, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      // Authenticate the user
      const authResponse = await axios.post(
        'http://192.168.254.103:3001/api/auth',
        { email: email.trim(), password: password.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (authResponse.status === 200 && authResponse.data?.user) {
        const { user } = authResponse.data;
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);

        // Call both endpoints concurrently
        const endpoints = [
          `http://192.168.254.103:3001/api/member/email/${user.email}`,
          `http://192.168.254.103:3001/api/user/email/${user.email}`
        ];
        const requests = endpoints.map(url => axios.get(url));
        const results = await Promise.allSettled(requests);

        // Filter for successful responses with data
        const validResults = results.filter(
          result =>
            result.status === 'fulfilled' &&
            result.value.status === 200 &&
            result.value.data
        );

        if (validResults.length > 0) {
          // If both endpoints return data, try to prioritize one that is not "Member"
          let chosenResponse = null;
          for (let res of validResults) {
            const data = res.value.data;
            // Try to get the candidate user object from different keys or directly
            const candidate = data.user || data.member || data;
            if (candidate && candidate.userType && candidate.userType !== 'Member') {
              chosenResponse = res.value;
              break;
            }
          }
          if (!chosenResponse) {
            chosenResponse = validResults[0].value;
          }

          // Retrieve the found user from the response data
          const data = chosenResponse.data;
          const foundUser = data.user || data.member || data;

          if (!foundUser) {
            setErrorMessage('User data not found.');
          } else {
            localStorage.setItem('userEmail', user.email)
            sessionStorage.setItem('usertype', foundUser.userType || '');
            sessionStorage.setItem('password', foundUser.password || '');
            sessionStorage.setItem('username', foundUser.userName || '');
            sessionStorage.setItem('memberId', foundUser.memberId || '');

            

            alert('Login successful!');

            // Redirect based on the user type
            switch (foundUser.userType) {
              case 'Member':
                setRedirectPath('/member-dashboard')
                break
              case 'System Admin':
                setRedirectPath('/dashboard');
                break;
              case 'Treasurer':
                setRedirectPath('/loan-approval');
                break;
              case 'Loan Manager':
                setRedirectPath('/apply-for-loan');
                break;
              case 'Teller':
                setRedirectPath('/dashboard');
                break;
                default:
                  setRedirectPath('/authorize'); // Redirect to the authorize page
                  break;
              
            }
          }
        } else {
          setErrorMessage('Invalid response from server.');
        }
      } else {
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error);
      setErrorMessage(
        error.response?.data?.error || 'Invalid email or password'
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Sibbap Logo" className="w-32 sm:w-48" />
        </div>
        {errorMessage && (
          <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md py-2 px-3 focus:ring focus:ring-green-300"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-md py-2 px-3 focus:ring focus:ring-green-300"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
