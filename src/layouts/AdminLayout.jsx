import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../shared/components/partials/Sidebar";
import Header from "../shared/components/partials/Header";

const AdminLayout = () => {
  useEffect(() => {
    // Request Notification Permission for admin
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("Admin: Notification permission granted.");
        } else {
          console.warn("Admin: Notification permission denied.");
        }
      } catch (error) {
        console.error("Admin: Error requesting notification permission:", error);
      }
    };
    requestNotificationPermission();
  }, []);

  const name = sessionStorage.getItem("username") || "Jane Doe";
  const userType = sessionStorage.getItem("usertype") || "Administrator";
  const imageUrl = sessionStorage.getItem("imageUrl") || "https://via.placeholder.com/150";

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Header name={name} userType={userType} imageUrl={imageUrl} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
