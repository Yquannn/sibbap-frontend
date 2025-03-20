import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const userType = sessionStorage.getItem("userType"); // Get user role from session

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />; // Redirect unauthorized users
  }

  return <Outlet />;
};

export default ProtectedRoute;
