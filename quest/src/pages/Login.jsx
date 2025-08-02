import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.prefilledEmail || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/admin";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  // Show toast after register
  useEffect(() => {
    if (location.state?.fromRegister) {
      toast.info("✅ Account created! Please login.");
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      toast.success("🎉 Login successful!");
    } catch (err) {
      const msg = err.message?.includes("fetch")
        ? "🚫 Network error - backend unreachable"
        : err.message;

      setError(msg);
      toast.error(`Login failed: ${msg}`);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
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
            Sign in to continue
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
          </motion.div>

          <motion.button
            type="submit"
            className="login-button"
            disabled={isLoading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                Sign In
                <AnimatePresence>
                  {hovered && (
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
          transition={{ delay: 0.7 }}
        >
          <p>
            Don’t have an account?{" "}
            <a href="/register" className="signup-link">
              Sign up
            </a>
          </p>
        </motion.div>
      </motion.div>

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
