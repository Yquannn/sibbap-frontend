import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import MemberLayout from "./MemberLayout";

const RootLayout = () => {
  const userType = localStorage.getItem("userType"); 

  if (userType === "admin") {
    return <AdminLayout />;
  } else if (userType === "member") {
    return <MemberLayout />;
  } else {
    return <Navigate to="/" />;
  }
};

export default RootLayout;
