// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // or Register.css

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/admin");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const API_BASE =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    const url = `${API_BASE}/api/auth/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      const { token, user } = data;

      // ✅ Decode and validate token
      const decoded = jwtDecode(token);
      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        throw new Error("Token expired or invalid");
      }

      // ✅ Store credentials
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("✅ Registration successful! Redirecting...");
      navigate("/admin");
    } catch (err) {
      const msg = err.message.includes("fetch")
        ? "⚠️ Network error - backend not reachable"
        : err.message;
      setError(msg);
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* 🔆 Background animation */}
      <motion.div
        className="login-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="gradient-circle top-left"
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="gradient-circle bottom-right"
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>

      {/* 🧾 Register Form */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="login-header">
          <motion.div
            className="logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span>YAFAFA</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Create Admin Account
          </motion.h2>

          <motion.p
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Register for full access to the admin dashboard
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {error.toLowerCase().includes("already") ? (
                  <>
                    {error}{" "}
                    <Link to="/login" className="signup-link">
                      Go to Login
                    </Link>
                  </>
                ) : (
                  error
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="input-field"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label htmlFor="password">Create Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              className="input-field"
              required
              disabled={loading}
            />
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="spinner" aria-label="Loading..."></span>
            ) : (
              <>Register Now →</>
            )}
          </motion.button>
        </form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p>
            Already have an account?{" "}
            <Link to="/login" className="signup-link">
              Login here
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
