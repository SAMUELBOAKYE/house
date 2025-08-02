// src/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import { apiClient } from "./utils/apiClient";
import "./Dashboard.css";

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    total: "Loading...",
    pending: "Loading...",
    revenue: "Loading...",
    error: null,
    isLoading: true,
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient("/api/bookings");

        setStats({
          error: null,
          total: data.totalBookings || data.length || "0",
          pending: data.pendingBookings || "0",
          revenue: data.revenue ? parseFloat(data.revenue).toFixed(2) : "0.00",
          isLoading: false,
        });
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          error: err.message || "Failed to fetch stats.",
          isLoading: false,
        }));
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const statItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        toggleCollapse={toggleSidebar}
      />

      <div
        className="dashboard-main-content"
        style={{
          marginLeft: sidebarCollapsed ? "80px" : "350px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <main className="dashboard-content">
          {stats.error ? (
            <div className="error-container">
              <p className="error-message">{stats.error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : stats.isLoading ? (
            <p className="loading">Loading statistics...</p>
          ) : (
            <motion.section
              className="stats-section"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="stat-card" variants={statItemVariants}>
                <h3>Total Bookings</h3>
                <p>{stats.total}</p>
              </motion.div>

              <motion.div className="stat-card" variants={statItemVariants}>
                <h3>Pending</h3>
                <p>{stats.pending}</p>
              </motion.div>

              <motion.div className="stat-card" variants={statItemVariants}>
                <h3>Revenue (GHS)</h3>
                <p>{stats.revenue}</p>
              </motion.div>
            </motion.section>
          )}
        </main>

        <section className="welcome-section">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Welcome to Yafafa
          </motion.h2>
          <motion.p
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            A peaceful, stylish retreat — your home away from home
          </motion.p>
          <div className="action-buttons">
            <motion.a
              href="/book"
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              BOOK YOUR STAY
            </motion.a>
            <motion.a
              href="/rooms"
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW ROOMS
            </motion.a>
          </div>
        </section>

        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
