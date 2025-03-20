import React from "react";
import { Outlet } from "react-router-dom";

const BareLayout = () => {
  return (
    <div className="min-h-screen p-4">
      <Outlet />
    </div>
  );
};

export default BareLayout;
