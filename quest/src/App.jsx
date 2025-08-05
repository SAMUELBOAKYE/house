// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context and Error Handling
import { AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./ErrorBoundary";
import ProtectedRoute from "./ProtectedRoute";

// Components and Pages
import Header from "./header";
import Home from "./home";
import Rooms from "./rooms";
import BookingPage from "./BookingPage";
import Payment from "./payment";
import PaymentSuccess from "./paymentSuccess";
import RoomSummary from "./RoomSummary";

import Login from "./pages/Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

import AdminDashboard from "./AdminSidebar";

// Layout Component
const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useContext(AuthContext);

  const hideHeaderRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  if (loading) {
    return <div className="loading-screen">Loading session...</div>;
  }

  return (
    <>
      {!shouldHideHeader && <Header />}
      <ToastContainer position="top-center" autoClose={5000} />
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/room-summary" element={<RoomSummary />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/admin" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/admin" replace /> : <Register />
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};

export default AppLayout;
