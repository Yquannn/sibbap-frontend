import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ConciergeBell, 
  PiggyBank, 
  Banknote, 
  ArrowRight, 
  Briefcase, 
  DollarSign, 
  CircleAlert 
} from "lucide-react";
import { motion } from "framer-motion";
import defaultPicture from "../assets/blankPicture.png";
import ShareCapitalCalculator from "./utils/ShareCapitalCalculator";
import { count } from "../notification/NotificationPage";

export let memberId = "";

// Skeleton component to mimic the dashboard UI
const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between bg-gray-200 p-2 rounded-lg animate-pulse">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="ml-3">
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
            <div className="w-24 h-3 bg-gray-300 rounded mt-1"></div>
          </div>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
      {/* Balance Cards Skeleton */}
      <div className="mt-4 space-y-4">
        <div className="flex space-x-4 overflow-x-auto">
          {[...Array(1)].map((_, index) => (
            <div key={index} className="w-[300px] h-32 bg-gray-300 rounded-lg animate-pulse"></div>
          ))}
        </div>
        {/* Math Tools Skeleton */}
        <div className="mt-4">
          <div className="w-40 h-7 bg-gray-300 rounded mb-2"></div>
          <div className="flex space-x-2 overflow-x-auto">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="w-[220px] h-32 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        {/* Announcements Skeleton */}
        <div className="mt-4">
          <div className="w-48 h-7 bg-gray-300 rounded mb-2"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(true); // for initial load
  const [refreshing, setRefreshing] = useState(false); // for refresh on scroll up
  const [error, setError] = useState("");
  const [activeIndex2, setActiveIndex2] = useState(0);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const scrollRef2 = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  let notificationCount = count;

  const dummyMember = {
    announcements: [
      { title: "System Maintenance👨‍🔧", description: "Scheduled maintenance on Feb 20, 2025, from 2 AM to 4 AM." },
      { title: "New Feature Released!😲", description: "We've added a loan calculator for better financial planning." },
    ],
    badge: "Top Saver 🏆",
  };

  const handleScroll2 = () => {
    if (scrollRef2.current) {
      const scrollLeft = scrollRef2.current.scrollLeft;
      const cardWidth = 320; // Adjust based on actual card width + margin
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex2(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 220; // Adjust based on actual card width + margin
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  memberId = member.memberId;

  // Function to fetch/reload member data.
  // When called with isRefresh=true, we simulate a slight delay so the refresh indicator shows.
  const fetchMemberData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
      // Simulate a delay (e.g., 1 second) so the refresh indicator remains visible.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } else {
      setLoading(true);
    }
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        throw new Error("User email not found. Please log in again.");
      }
      const response = await axios.get(
        `http://192.168.254.103:3001/api/member/email/${email}`
      );
      if (response.data) {
        setMember(response.data);
      } else {
        throw new Error("No member data found.");
      }
    } catch (err) {
      setError(err.message || "Error fetching member data.");
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMemberData();
  }, []);

  // Scroll listener: reload data when user scrolls upward more than 50px.
  // When triggered, the refresh indicator will appear.
  const lastScrollY = useRef(window.pageYOffset);
  useEffect(() => {
    const threshold = 50;
    const handleWindowScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (!loading && !refreshing && lastScrollY.current - currentScrollY > threshold) {
        fetchMemberData(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, [loading, refreshing]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen relative">
      {/* Refreshing Indicator */}
      {refreshing && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 mb-4">
          <div className="">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>

      )}

      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
        <div className="flex items-center">
          <img
            src={
              member?.id_picture
                ? `http://192.168.254.103:3001/uploads/${member.id_picture}`
                : defaultPicture
            }
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-green-500 cursor-pointer"
            onClick={() => navigate("/member-profile")}
          />
          <div className="ml-3">
            <p className="text-lg font-semibold">
              {member?.first_name} {member?.last_name}
            </p>
            <p className="text-sm">
              Code No. <span className="text-gray-500 text-sm">{member.memberCode}</span>
            </p>
          </div>
        </div>

        {/* Notification Button with Count Badge */}
        <div className="relative">
          <button
            className="text-green-600 p-2 rounded-full bg-green-50 flex items-center justify-center"
            onClick={() => navigate("/member-notification")}
          >
            <ConciergeBell className="w-6 h-6" />
            {notificationCount > 0 && (
              <span
                className={`absolute top-1 -right-0.5 bg-red-500 text-white font-bold rounded-full flex items-center justify-center 
                  px-2 py-0.5 ${notificationCount >= 100 ? "text-[10px] min-w-[28px]" : "text-xs min-w-[20px]"}`}
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Balance Cards Section */}
      <div className="relative w-full max-w-md mx-auto mt-4">
        <div
          ref={scrollRef2}
          onScroll={handleScroll2}
          className="flex overflow-x-auto space-x-4 snap-x snap-mandatory pb-4 scrollbar-hide"
        >
          {/* Regular Savings */}
          <motion.div className="snap-center shrink-0 w-[300px]">
            <div className="bg-green-600 text-white p-6 rounded-lg w-full">
              <p className="text-sm text-gray-100">Regular Savings Balance</p>
              <p className="text-4xl font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.savingsAmount || 0)}
              </p>
              <hr className="my-3 border-t border-white/30" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-100">Total Earnings</p>
                <button
                  className="text-white text-sm font-semibold"
                  onClick={() => navigate("/member-regular-savings-transaction")}
                >
                  View history
                </button>
              </div>
              <p className="text-sm font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.totalEarnings || 0.0)}
              </p>
            </div>
          </motion.div>

          {/* Share Capital */}
          <motion.div className="snap-center shrink-0 w-[300px]">
            <div className="bg-cyan-600 text-white p-6 rounded-lg w-full">
              <p className="text-sm text-gray-100">Share Capital</p>
              <p className="text-4xl font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.shareCapital || 0)}
              </p>
              <hr className="my-3 border-t border-white/30" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-100">Total Collected Dividends</p>
                <button
                  className="text-white text-sm font-semibold"
                  onClick={() => navigate("/member-regular-savings-transaction")}
                >
                  View history
                </button>
              </div>
              <p className="text-sm font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.totalEarnings || 0.0)}
              </p>
            </div>
          </motion.div>

          {/* Time Deposit */}
          <motion.div className="snap-center shrink-0 w-[300px]">
            <div className="bg-green-600 text-white p-6 rounded-lg w-full">
              <p className="text-sm text-gray-100">Time Deposit Balance</p>
              <p className="text-4xl font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.timeDepositAmount || 0)}
              </p>
              <hr className="my-3 border-t border-white/30" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-100">Total Earnings</p>
                <button
                  className="text-white text-sm font-semibold"
                  onClick={() => navigate("/member-regular-savings-transaction")}
                >
                  View history
                </button>
              </div>
              <p className="text-sm font-bold">
                ₱{new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2 }).format(member?.totalEarnings || 0.0)}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center mt-1 space-x-2">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                activeIndex2 === index ? "bg-gray-500 w-2.3 h-2.3" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Math Tools Section */}
      <div className="mt-4">
      <div className="mb-2">
          <div className="text-sm font-medium text-gray-700 font-semibold">Let’s Do Some Math!</div>
        </div>
        {/* <h2 className="text-lg font-semibold text-gray-700">Let’s Do Some Math!</h2> */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto space-x-2 mt-2 pb-2 scrollbar-hide"
        >
          {/* Savings Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center min-w-[220px]">
            <PiggyBank size={40} className="text-green-500 mx-auto" />
            <h3 className="text-md font-semibold mt-2">Savings</h3>
            <p className="text-gray-600 text-sm">Save money and earn interest.</p>
            <button
              className="mt-3 flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
              onClick={() => navigate("/regular-savings-calculator")}
            >
              Calculate <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          {/* Loan Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center min-w-[220px]">
            <Banknote size={40} className="text-cyan-500 mx-auto" />
            <h3 className="text-md font-semibold mt-2">Loan</h3>
            <p className="text-gray-600 text-sm">Apply for a loan with low interest.</p>
            <button className="mt-3 flex items-center justify-center w-full bg-cyan-500 text-white py-2 px-4 rounded-lg shadow hover:bg-cyan-600">
              Calculate <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          {/* Time Deposit Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center min-w-[220px]">
            <Briefcase size={40} className="text-green-500 mx-auto" />
            <h3 className="text-md font-semibold mt-2">Time Deposit</h3>
            <p className="text-gray-600 text-sm">Grow your money with fixed returns.</p>
            <button
              onClick={() => navigate("/timedeposit-calculator")}
              className="mt-3 flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
            >
              Calculate <ArrowRight size={18} className="ml-2" />
            </button>
          </div>

          {/* Share Capital Card */}
          <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 text-center min-w-[220px]">
            <DollarSign size={40} className="text-cyan-500 mx-auto" />
            <h3 className="text-md font-semibold mt-2">Share Capital</h3>
            <p className="text-gray-600 text-sm">Investing today secures tomorrow.</p>
            <button
              className="mt-3 flex items-center justify-center w-full bg-cyan-500 text-white py-2 px-4 rounded-lg shadow hover:bg-cyan-600"
              onClick={() => setModalOpen(true)}
            >
              Calculate <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        </div>

        {/* Active Indicator Dots */}
        <div className="flex justify-center mt-1 space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                activeIndex === index ? "bg-gray-500 w-2.3 h-2.3" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Announcements & Badge Section */}
      <div className="mb-3">
        <div className="mt-3">
        <div className="mb-2">
          <div className="text-sm font-medium text-gray-700 font-semibold">Important Announcement!</div>
        </div>
          {/* <h2 className="text-lg font-semibold text-gray-700">Important Announcement!</h2> */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            {(member?.announcements?.length ? member.announcements : dummyMember.announcements).map(
              (announcement, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-md font-semibold">{announcement.title}</h3>
                  <p className="text-gray-600 text-sm">{announcement.description}</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-3 bg-gray-100 p-4 rounded-lg text-center">
          <p className="text-gray-700 text-sm">Earned a Badge</p>
          <p className="text-lg font-bold">{member?.badge || dummyMember.badge}</p>
        </div>
      </div>

      {/* Share Capital Calculator Modal */}
      <ShareCapitalCalculator isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
