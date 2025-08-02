// src/apiConfig.js

// ✅ Named export: centralized API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    refresh: "/api/auth/refresh",
    me: "/api/auth/me",
  },
  users: "/api/users",
  pets: "/api/pets",
  products: "/api/products",
  orders: "/api/orders",
  bookings: {
    base: "/api/bookings",
    all: "/api/bookings/all",
    myBookings: "/api/bookings/my",
  },
  admin: {
    dashboard: "/api/admin/dashboard", // optional admin route if needed
  },
};

// ✅ Default export: base URL config
const apiConfig = {
  baseURL:
    import.meta.env.MODE === "production"
      ? "http://localhost:5000" // 👈 Replace with live URL when deployed
      : "http://localhost:5000",
};

export default apiConfig;
