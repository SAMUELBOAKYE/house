// src/utils/apiClient.js
import axios from "axios";

// === Base URL Setup ===
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

// === Token Helpers ===
const getAccessToken = () => localStorage.getItem("token");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setAccessToken = (token) => localStorage.setItem("token", token);

// === Auth Cleanup + Redirect ===
export const clearAuthTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const handleAuthFailure = () => {
  clearAuthTokens();
  window.location.href = "/login";
};

// === Refresh Token Handler ===
export const refreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token found");

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh token invalid");

    const data = await response.json();
    if (!data.accessToken) throw new Error("No new token provided");

    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("🔁 Token refresh failed:", error.message);
    handleAuthFailure();
    return null;
  }
};

// === Axios Instance ===
const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Request Interceptor ===
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === Response Interceptor ===
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 403 && !originalRequest._retry && getRefreshToken()) {
      originalRequest._retry = true;

      const newToken = await refreshToken();
      if (newToken) {
        axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      }
    }

    if (status === 401) {
      handleAuthFailure(); // token & refresh expired
    }

    return Promise.reject(error);
  }
);

// === Fetch API Helper (Optional) ===
export const fetchApi = async (url, options = {}) => {
  const token = getAccessToken();

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API error");
  }

  return response.json();
};

// === CRUD Helper ===
const apiClient = {
  get: async (url, config = {}) => (await axiosClient.get(url, config)).data,
  post: async (url, data, config = {}) =>
    (await axiosClient.post(url, data, config)).data,
  put: async (url, data, config = {}) =>
    (await axiosClient.put(url, data, config)).data,
  delete: async (url, config = {}) =>
    (await axiosClient.delete(url, config)).data,
};

// === Export Everything ===
export default apiClient;
export { axiosClient };
