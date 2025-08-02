// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Create context
export const AuthContext = createContext();

// ✅ Axios instance with defaults
const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ Error handler
const handleApiError = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response)
    return `Error ${error.response.status}: ${error.response.statusText}`;
  if (error.request)
    return "No response from server. Please check your network.";
  return error.message || "Unexpected error occurred";
};

// ✅ AuthProvider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  // 🧹 Clear all auth info
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    delete apiClient.defaults.headers.common["Authorization"];

    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  };

  // 🔐 Login
  const login = async ({ email, password }) => {
    try {
      if (!email || !password) throw new Error("Email and password required");
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.refreshToken)
        localStorage.setItem("refreshToken", data.refreshToken);

      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;

      setAuthState({
        isAuthenticated: true,
        user: data.user,
        isLoading: false,
      });

      navigate("/admin");
      return { success: true };
    } catch (error) {
      clearAuth();
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const register = async ({ fullName, email, password }) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const res = await apiClient.post("/register", {
        fullName,
        email,
        password,
      });

      if (res.data?.success) {
        navigate("/login", {
          state: { prefilledEmail: email, fromRegister: true },
        });
        return { success: true };
      }

      throw new Error(res.data?.message || "Registration failed");
    } catch (error) {
      const message = handleApiError(error);
      const exists =
        error.response?.status === 400 &&
        message.toLowerCase().includes("already");

      return { success: false, exists, message };
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const verifySession = async () => {
    try {
      await apiClient.get("/verify");
      return true;
    } catch (error) {
      console.warn("Session invalid:", handleApiError(error));
      return false;
    }
  };

  const restoreSession = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (!token || !user) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const parsedUser = JSON.parse(user);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const isValid = await verifySession();
      if (!isValid) throw new Error("Invalid session");

      setAuthState({
        isAuthenticated: true,
        user: parsedUser,
        isLoading: false,
      });
    } catch (error) {
      clearAuth();
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  useEffect(() => {
    restoreSession();
    const timeout = setTimeout(() => {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        isLoading: authState.isLoading,
        login,
        logout,
        register,
      }}
    >
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
