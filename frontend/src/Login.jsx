

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, login } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login({ email, password });

      if (result) {
        toast.success("✅ Login successful!");
        navigate("/admin", { replace: true });
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);
      toast.error(`❌ ${message}`);
    }
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
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

      {/* Login Card */}
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="login-header">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="login-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Sign in to your admin dashboard
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              autoComplete="username"
            />
            <span className="input-highlight" />
          </motion.div>

          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              autoComplete="current-password"
            />
            <span className="input-highlight" />
          </motion.div>

          <motion.div
            className="form-options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="remember-me">
              <input type="checkbox" /> <span>Remember me</span>
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <span>Sign In</span>
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      className="arrow"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      →
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.button>
        </form>

        <motion.div
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="signup-link">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;

