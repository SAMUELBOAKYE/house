import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🕒 Show loader while checking session
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
        }}
      >
        🔐 Checking session...
      </div>
    );
  }

  // ❌ If not logged in, redirect to login and preserve route
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ Render children or nested route
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
