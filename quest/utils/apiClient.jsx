// src/utils/apiClient.jsx

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * 🔁 Refresh access token using refresh token
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }, []),
    }, []);

    if (!res.ok) return null;

    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (err) {
    console.error("🔒 Token refresh error:", err.message);
    return null;
  }
};

/**
 * 🌐 Custom fetch wrapper with token and refresh logic
 */
export const apiClient = async (url, options = {}, retryCount = 0) => {
  let token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}, []),
    "Content-Type":
      options.body instanceof FormData ? undefined : "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Send the request
  let response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  }, []);

  // If unauthorized, try refreshing token once
  if ((response.status === 401 || response.status === 403) && retryCount < 1) {
    const newToken = await refreshToken();

    if (!newToken) {
      console.warn("🔐 Session expired. Redirecting...");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }

    // Retry with new token
    headers.Authorization = `Bearer ${newToken}`;
    return apiClient(url, { ...options, headers }, retryCount + 1);
  }

  // If still bad response
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}, []));
    throw new Error(errorData.message || `Request failed: ${response.status}`);
  }

  // All good
  return response.json();
};
