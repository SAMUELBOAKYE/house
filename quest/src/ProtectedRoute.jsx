import React, { useEffect, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const location = useLocation();
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || token.split(".").length !== 3) {
      console.warn("No or malformed token found.");
      handleLogout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        console.warn("🔐 Token has expired.");
        handleLogout();
      }
    } catch (error) {
      console.error(" Invalid token:", error.message);
      handleLogout();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    logout?.();
    setTokenValid(false);
  };

  if (isLoading) {
    return <div style={styles.loading}>⏳ Verifying session...</div>;
  }

  if (!isAuthenticated || !tokenValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const styles = {
  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.2rem",
    color: "#444",
    backgroundColor: "#f0f0f0",
  },
};

export default ProtectedRoute;
